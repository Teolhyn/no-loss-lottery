use soroban_sdk::{contract, contractimpl, token, Address, Env};

use crate::error::LotteryError;
use crate::storage;
use crate::storage::{LotteryStatus, Ticket};

#[contract]
struct NoLossLottery;

#[contractimpl]
impl NoLossLottery {
    pub fn initialize() {}

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
}
