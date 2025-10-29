use soroban_sdk::{contract, contractimpl, token, Address, Env};

use crate::error::LotteryError;
use crate::storage;
use crate::storage::{LotteryState, LotteryStatus, Ticket};

#[contract]
struct NoLossLottery;

#[contractimpl]
impl NoLossLottery {
    pub fn __constructor(e: Env, admin: Address, token: Address, ticket_amount: i128) {
        // No require_auth needed - the deployer provides authorization
        // Constructor can only be called once during deployment

        storage::write_admin(&e, &admin);
        storage::write_lottery_status(&e, &LotteryStatus::BuyIn);
        storage::write_currency(&e, &token);
        storage::write_token_amount(&e, &ticket_amount);

        let initial_state = LotteryState {
            status: LotteryStatus::BuyIn,
            no_participants: 0,
            amount_of_yield: 0,
            token: token.clone(),
        };
        storage::write_lottery_state(&e, &initial_state);
    }

    pub fn buy_ticket(e: Env, user: Address) -> Result<Ticket, LotteryError> {
        user.require_auth();

        if storage::read_lottery_status(&e)? != LotteryStatus::BuyIn {
            return Err(LotteryError::WrongStatus);
        }

        let token = storage::read_currency(&e)?;
        let amount = storage::read_token_amount(&e)?;
        let token_client = token::Client::new(&e, &token);
        token_client.transfer(&user, &e.current_contract_address(), &amount);

        let ticket_id = storage::get_and_increment_ticket_counter(&e);

        let ticket = Ticket {
            id: ticket_id,
            user: user.clone(),
            token,
            amount,
            won: false,
        };

        storage::write_ticket(&e, &ticket);
        storage::add_ticket_to_user(&e, &user, ticket_id);

        Ok(ticket)
    }

    pub fn redeem_ticket(e: Env, ticket: Ticket) -> Result<(), LotteryError> {
        ticket.user.require_auth();

        let state = storage::read_lottery_state(&e)?;
        let token_client = token::Client::new(&e, &ticket.token);

        let result = match (state.status, ticket.won) {
            (LotteryStatus::YieldFarming, _) => Err(LotteryError::WrongStatus),

            (LotteryStatus::BuyIn, _) => {
                token_client.transfer(&e.current_contract_address(), &ticket.user, &ticket.amount);
                Ok(())
            }

            (LotteryStatus::Ended, true) => {
                token_client.transfer(
                    &e.current_contract_address(),
                    &ticket.user,
                    &(ticket.amount + state.amount_of_yield),
                );
                Ok(())
            }

            (LotteryStatus::Ended, false) => {
                token_client.transfer(&e.current_contract_address(), &ticket.user, &ticket.amount);
                Ok(())
            }
        };

        // If redemption was successful, remove ticket from user's list
        if result.is_ok() {
            storage::remove_ticket_from_user(&e, &ticket.user, ticket.id);
        }

        result
    }

    pub fn raffle(e: Env) -> Result<Ticket, LotteryError> {
        if storage::read_lottery_status(&e)? != LotteryStatus::Ended {
            return Err(LotteryError::WrongStatus);
        }

        //TODO: random raffle
        let winner_id = 1;

        let mut winner_ticket = storage::read_ticket(&e, winner_id)?;
        winner_ticket.won = true;
        storage::write_ticket(&e, &winner_ticket);

        Ok(winner_ticket)
    }

    pub fn set_status(
        e: Env,
        admin: Address,
        new_status: LotteryStatus,
    ) -> Result<(), LotteryError> {
        admin.require_auth();

        if !storage::is_admin(&e, &admin) {
            return Err(LotteryError::NotAuthorized);
        }

        storage::write_lottery_status(&e, &new_status);

        // Update lottery state as well
        let mut state = storage::read_lottery_state(&e)?;
        state.status = new_status;
        storage::write_lottery_state(&e, &state);

        Ok(())
    }

    pub fn get_lottery_state(e: Env) -> Result<LotteryState, LotteryError> {
        storage::read_lottery_state(&e)
    }

    pub fn get_admin(e: Env) -> Option<Address> {
        storage::read_admin(&e)
    }

    pub fn get_user_tickets(
        e: Env,
        user: Address,
    ) -> Result<soroban_sdk::Vec<Ticket>, LotteryError> {
        let ticket_ids = storage::get_user_tickets(&e, &user);
        let mut tickets = soroban_sdk::Vec::new(&e);

        for ticket_id in ticket_ids.iter() {
            match storage::read_ticket(&e, ticket_id) {
                Ok(ticket) => tickets.push_back(ticket),
                Err(_) => continue, // Skip tickets that can't be read
            }
        }

        Ok(tickets)
    }

    pub fn blend_it(e: Env) -> Result<(), LotteryError> {
        if storage::read_lottery_status(&e)? != LotteryStatus::YieldFarming {
            return Err(LotteryError::WrongStatus);
        }
        let token_client = token::Client::new(&e, &storage::read_currency(&e)?);
        let contract_balance = token_client.balance(&e.current_contract_address());

        //TODO: Send tokens to blend

        storage::write_sent_balance(&e, &contract_balance);
        Ok(())
    }

    pub fn withdraw_from_blend(e: Env) -> Result<i128, LotteryError> {
        if storage::read_lottery_status(&e)? != LotteryStatus::Ended {
            return Err(LotteryError::WrongStatus);
        }
        //TODO: Withdraw everything from blend. Emissions to admin.

        let token_client = token::Client::new(&e, &storage::read_currency(&e)?);
        let contract_balance = token_client.balance(&e.current_contract_address());

        let sent_to_blend = storage::read_sent_balance(&e)?;
        let yield_gained = contract_balance - sent_to_blend;

        let mut lottery_state = storage::read_lottery_state(&e)?;
        lottery_state.amount_of_yield = yield_gained;
        storage::write_lottery_state(&e, &lottery_state);

        Ok(yield_gained)
    }
}
