use soroban_sdk::{contract, contractimpl, token, Address, Env};

use crate::error::LotteryError;
use crate::storage;
use crate::storage::{LotteryState, LotteryStatus, Ticket};

#[contract]
struct NoLossLottery;

#[contractimpl]
impl NoLossLottery {
    pub fn __constructor(
        e: Env,
        admin: Address,
        token: Address,
        ticket_amount: i128,
    ) {
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
            user,
            token,
            amount,
            won: false,
        };

        storage::write_ticket(&e, &ticket);

        Ok(ticket)
    }

    pub fn redeem_ticket(e: Env, ticket: Ticket) -> Result<(), LotteryError> {
        ticket.user.require_auth();

        let state = storage::read_lottery_state(&e)?;
        let token_client = token::Client::new(&e, &ticket.token);

        match (state.status, ticket.won) {
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
        }
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
}
