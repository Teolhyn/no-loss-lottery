use crate::error::LotteryError;
use soroban_sdk::{contracttype, Address, Bytes, Env, Vec};

#[derive(PartialEq, Eq, Debug, Clone)]
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
    pub in_blender: bool,
}

#[derive(Debug, PartialEq, Eq, Clone)]
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
    Admin,
    LotteryStatus,
    Currency,
    TokenAmount,
    LotteryState,
    Ticket(u32),
    TicketCounter,
    UserTickets(Address),
    SentBalance,
    Blender,
    Ids,
    WinnerSelected,
    Seed,
}

pub fn write_admin(e: &Env, admin: &Address) {
    e.storage().instance().set(&Key::Admin, admin);
}

pub fn read_admin(e: &Env) -> Option<Address> {
    e.storage().instance().get(&Key::Admin)
}

pub fn is_admin(e: &Env, address: &Address) -> bool {
    if let Some(admin) = read_admin(e) {
        admin == *address
    } else {
        false
    }
}

pub fn write_lottery_status(e: &Env, status: &LotteryStatus) {
    e.storage().instance().set(&Key::LotteryStatus, status);
}

pub fn read_lottery_status(e: &Env) -> Result<LotteryStatus, LotteryError> {
    e.storage()
        .instance()
        .get(&Key::LotteryStatus)
        .ok_or(LotteryError::LotteryStatusNotFound)
}

pub fn write_currency(e: &Env, token: &Address) {
    e.storage().persistent().set(&Key::Currency, token);
}

pub fn read_currency(e: &Env) -> Result<Address, LotteryError> {
    e.storage()
        .persistent()
        .get(&Key::Currency)
        .ok_or(LotteryError::LotteryCurrencyNotFound)
}

pub fn write_token_amount(e: &Env, amount: &i128) {
    e.storage().persistent().set(&Key::TokenAmount, amount);
}

pub fn read_token_amount(e: &Env) -> Result<i128, LotteryError> {
    e.storage()
        .persistent()
        .get(&Key::TokenAmount)
        .ok_or(LotteryError::TokenAmountNotFound)
}

pub fn write_lottery_state(e: &Env, state: &LotteryState) {
    e.storage().persistent().set(&Key::LotteryState, state);
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

    // Add ticket ID to active IDs list
    let mut ids: Vec<u32> = e
        .storage()
        .persistent()
        .get(&Key::Ids)
        .unwrap_or(Vec::new(e));
    ids.push_back(ticket.id);
    e.storage().persistent().set(&Key::Ids, &ids);
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
    e.storage().persistent().remove(&Key::Ticket(ticket.id));

    // Remove ticket ID from active IDs list
    let ids: Vec<u32> = e
        .storage()
        .persistent()
        .get(&Key::Ids)
        .unwrap_or(Vec::new(e));

    let mut new_ids = Vec::new(e);
    for id in ids.iter() {
        if id != ticket.id {
            new_ids.push_back(id);
        }
    }
    e.storage().persistent().set(&Key::Ids, &new_ids);
}

pub fn add_ticket_to_user(e: &Env, user: &Address, ticket_id: u32) {
    let mut tickets: soroban_sdk::Vec<u32> = e
        .storage()
        .persistent()
        .get(&Key::UserTickets(user.clone()))
        .unwrap_or(soroban_sdk::Vec::new(e));

    tickets.push_back(ticket_id);
    e.storage()
        .persistent()
        .set(&Key::UserTickets(user.clone()), &tickets);
}

pub fn get_user_tickets(e: &Env, user: &Address) -> soroban_sdk::Vec<u32> {
    e.storage()
        .persistent()
        .get(&Key::UserTickets(user.clone()))
        .unwrap_or(soroban_sdk::Vec::new(e))
}

pub fn remove_ticket_from_user(e: &Env, user: &Address, ticket_id: u32) {
    let tickets: soroban_sdk::Vec<u32> = e
        .storage()
        .persistent()
        .get(&Key::UserTickets(user.clone()))
        .unwrap_or(soroban_sdk::Vec::new(e));

    // Find and remove the ticket_id
    let mut new_tickets = soroban_sdk::Vec::new(e);
    for id in tickets.iter() {
        if id != ticket_id {
            new_tickets.push_back(id);
        }
    }

    e.storage()
        .persistent()
        .set(&Key::UserTickets(user.clone()), &new_tickets);
}

pub fn write_sent_balance(e: &Env, sent_amount: &i128) {
    e.storage().persistent().set(&Key::SentBalance, sent_amount);
}

pub fn read_sent_balance(e: &Env) -> Result<i128, LotteryError> {
    e.storage()
        .persistent()
        .get(&Key::SentBalance)
        .ok_or(LotteryError::SentToBlendNotFound)
}

pub fn write_blend_address(e: &Env, blend_address: &Address) {
    e.storage().instance().set(&Key::Blender, &blend_address);
}

pub fn read_blend_address(e: &Env) -> Result<Address, LotteryError> {
    e.storage()
        .instance()
        .get(&Key::Blender)
        .ok_or(LotteryError::BlenderNotFound)
}

pub fn read_ids(e: &Env) -> Result<Vec<u32>, LotteryError> {
    e.storage()
        .persistent()
        .get(&Key::Ids)
        .ok_or(LotteryError::IdsNotFound)
}

pub fn write_winner_selected(e: &Env, value: bool) {
    e.storage().instance().set(&Key::WinnerSelected, &value);
}

pub fn read_winner_selected(e: &Env) -> Result<bool, LotteryError> {
    e.storage()
        .instance()
        .get(&Key::WinnerSelected)
        .ok_or(LotteryError::WinnerSelectedNotFound)
}

pub fn write_seed(e: &Env, seed: &Bytes) {
    e.storage().instance().set(&Key::Seed, seed);
}

pub fn read_seed(e: &Env) -> Result<Bytes, LotteryError> {
    e.storage()
        .instance()
        .get(&Key::Seed)
        .ok_or(LotteryError::SeedNotFound)
}
