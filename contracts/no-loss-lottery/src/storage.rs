use crate::error::LotteryError;
use soroban_sdk::{contracttype, Address, Env};

#[derive(PartialEq, Eq, Debug)]
#[contracttype]
pub enum LotteryStatus {
    BuyIn,
    YieldFarming,
    Ended,
}

#[contracttype]
pub struct LotteryState {
    pub status: LotteryStatus,
    pub no_participants: u32,
    pub amount_of_yield: i128,
    pub token: Address,
}

#[contracttype]
pub struct Ticket {
    pub id: u32,
    pub user: Address,
    pub token: Address,
    pub amount: i128,
    pub won: bool,
}

#[derive(Clone)]
#[contracttype]
enum Key {
    LotteryStatus,
    Currency,
    TokenAmount,
    LotteryState,
    Ticket(u32),
    TicketCounter,
}

pub fn read_lottery_status(e: &Env) -> Result<LotteryStatus, LotteryError> {
    e.storage()
        .temporary()
        .get(&Key::LotteryStatus)
        .ok_or(LotteryError::LotteryStatusNotFound)
}

pub fn read_currency(e: &Env) -> Result<Address, LotteryError> {
    e.storage()
        .persistent()
        .get(&Key::Currency)
        .ok_or(LotteryError::LotteryCurrencyNotFound)
}

pub fn read_token_amount(e: &Env) -> Result<i128, LotteryError> {
    e.storage()
        .persistent()
        .get(&Key::TokenAmount)
        .ok_or(LotteryError::TokenAmountNotFound)
}

pub fn read_lottery_state(e: &Env) -> Result<LotteryState, LotteryError> {
    e.storage()
        .persistent()
        .get(&Key::LotteryState)
        .ok_or(LotteryError::LotteryStateNotFound)
}

pub fn read_ticket(e: &Env, id: u32) -> Result<Ticket, LotteryError> {
    e.storage()
        .persistent()
        .get(&Key::Ticket(id))
        .ok_or(LotteryError::TicketNotFound)
}

pub fn write_ticket(e: &Env, ticket: &Ticket) {
    e.storage()
        .persistent()
        .set(&Key::Ticket(ticket.id), ticket);
}

pub fn get_and_increment_ticket_counter(e: &Env) -> u32 {
    let current: u32 = e
        .storage()
        .persistent()
        .get(&Key::TicketCounter)
        .unwrap_or(0);
    let next = current + 1;
    e.storage().persistent().set(&Key::TicketCounter, &next);
    next
}

pub fn remove_ticket(e: &Env, ticket: Ticket) {
    e.storage().temporary().remove(&Key::Ticket(ticket.id));
}
