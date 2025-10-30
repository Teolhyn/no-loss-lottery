use soroban_sdk::{contract, contractimpl, token, vec, Address, Env};

use crate::error::LotteryError;
use crate::storage;
use crate::storage::{LotteryState, LotteryStatus, Ticket};

mod blend {
    soroban_sdk::contractimport!(file = "../../target/wasm32-unknown-unknown/release/pool.wasm");
}

#[contract]
struct NoLossLottery;

#[contractimpl]
impl NoLossLottery {
    pub fn __constructor(
        e: Env,
        admin: Address,
        token: Address,
        ticket_amount: i128,
        blend_address: Address,
    ) {
        storage::write_admin(&e, &admin);
        storage::write_lottery_status(&e, &LotteryStatus::BuyIn);
        storage::write_currency(&e, &token);
        storage::write_token_amount(&e, &ticket_amount);
        storage::write_blend_address(&e, &blend_address);
        storage::write_sent_balance(&e, &0_i128);

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

        // Check if this is the user's first ticket
        let user_tickets_before = storage::get_user_tickets(&e, &user);
        storage::add_ticket_to_user(&e, &user, ticket_id);

        if user_tickets_before.is_empty() {
            // First ticket for this user - increment unique participants
            let mut state = storage::read_lottery_state(&e)?;
            state.no_participants += 1;
            storage::write_lottery_state(&e, &state);
        }

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

        if result.is_ok() {
            storage::remove_ticket_from_user(&e, &ticket.user, ticket.id);

            // Check if user has no more tickets
            let user_tickets = storage::get_user_tickets(&e, &ticket.user);
            if user_tickets.is_empty() {
                // User has no more tickets - decrement unique participants
                let mut state = storage::read_lottery_state(&e)?;
                state.no_participants -= 1;
                storage::write_lottery_state(&e, &state);
            }
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

    pub fn get_ticket_amount(e: Env) -> Result<i128, LotteryError> {
        storage::read_token_amount(&e)
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
        let admin = storage::read_admin(&e).ok_or(LotteryError::AdminNotFound)?;
        admin.require_auth();
        let token_address = storage::read_currency(&e)?;
        let token_client = token::Client::new(&e, &token_address);
        let contract_balance = token_client.balance(&e.current_contract_address());

        let blend_address = storage::read_blend_address(&e)?;
        let blend_client = blend::Client::new(&e, &blend_address);

        let deposit_request = blend::Request {
            address: token_address,
            amount: contract_balance,
            request_type: 0,
        };

        token_client.transfer(&e.current_contract_address(), &admin, &contract_balance);

        blend_client.submit(&admin, &admin, &admin, &vec![&e, deposit_request]);

        let balance_before = storage::read_sent_balance(&e)?;
        storage::write_sent_balance(&e, &(contract_balance + balance_before));
        Ok(())
    }

    pub fn withdraw_from_blend(e: Env) -> Result<i128, LotteryError> {
        if storage::read_lottery_status(&e)? != LotteryStatus::Ended {
            return Err(LotteryError::WrongStatus);
        }
        let admin = storage::read_admin(&e).ok_or(LotteryError::AdminNotFound)?;
        admin.require_auth();
        let token_address = storage::read_currency(&e)?;
        let token_client = token::Client::new(&e, &token_address);
        let contract_balance = token_client.balance(&e.current_contract_address());

        let blend_address = storage::read_blend_address(&e)?;
        let blend_client = blend::Client::new(&e, &blend_address);

        let reserve_list = blend_client.get_reserve_list();
        let mut reserve_index: u32 = 0;
        for (i, address) in reserve_list.iter().enumerate() {
            if address == token_address {
                reserve_index = i as u32;
                break;
            }
        }

        // bTokens reserve_id * 2 + 1, dTokens reserve_id * 2.
        let reserve_token_id = reserve_index * 2 + 1;

        let positions = blend_client.get_positions(&admin);
        positions
            .supply
            .get(reserve_index)
            .ok_or(LotteryError::BlendPositionNotFound)?;

        let reserve_ids = vec![&e, reserve_token_id];
        blend_client.claim(&admin, &reserve_ids, &admin);

        let admin_balance_before = token_client.balance(&admin);

        let withdraw_request = blend::Request {
            address: token_address.clone(),
            amount: i128::MAX,
            request_type: 1,
        };

        blend_client.submit(&admin, &admin, &admin, &vec![&e, withdraw_request]);

        let admin_balance_after = token_client.balance(&admin);

        let balance_from_blend = admin_balance_after - admin_balance_before;

        token_client.transfer(&admin, &e.current_contract_address(), &balance_from_blend);

        let sent_to_blend = storage::read_sent_balance(&e)?;
        let yield_gained = balance_from_blend - sent_to_blend;

        let mut lottery_state = storage::read_lottery_state(&e)?;
        lottery_state.amount_of_yield = yield_gained;
        storage::write_lottery_state(&e, &lottery_state);

        Ok(yield_gained)
    }
}
