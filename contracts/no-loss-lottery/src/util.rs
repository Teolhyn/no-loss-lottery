use crate::{
    error::LotteryError,
    storage::{
        self, LotteryStatus, MIN_BUYIN_TIME_IN_LEDGERS, MIN_ENDED_TIME_IN_LEDGERS,
        MIN_YIELD_TIME_IN_LEDGERS,
    },
};
use soroban_sdk::{Bytes, Env};

pub fn generate_and_write_seed(e: &Env) {
    let timestamp = e.ledger().timestamp();
    let sequence = e.ledger().sequence();
    let mut seed_data = Bytes::new(e);
    seed_data.append(&Bytes::from_array(e, &timestamp.to_be_bytes()));
    seed_data.append(&Bytes::from_array(e, &sequence.to_be_bytes()));

    let seed_hash = e.crypto().sha256(&seed_data);
    let seed_bytes: Bytes = seed_hash.into();

    storage::write_seed(e, &seed_bytes);
}

pub fn is_timelock_passed(
    e: &Env,
    current_status: &LotteryStatus,
    new_status: &LotteryStatus,
) -> Result<bool, LotteryError> {
    let required_ledgers = match (current_status, new_status) {
        (LotteryStatus::BuyIn, LotteryStatus::YieldFarming) => MIN_BUYIN_TIME_IN_LEDGERS,
        (LotteryStatus::YieldFarming, LotteryStatus::Ended) => MIN_YIELD_TIME_IN_LEDGERS,
        (LotteryStatus::Ended, LotteryStatus::BuyIn) => MIN_ENDED_TIME_IN_LEDGERS,
        _ => return Ok(false),
    };

    let started_ledger = match current_status {
        LotteryStatus::BuyIn => storage::read_buyin_started_ledger(e)?,
        LotteryStatus::YieldFarming => storage::read_farming_started_ledger(e)?,
        LotteryStatus::Ended => storage::read_ended_started_ledger(e)?,
    };

    let current_ledger = e.ledger().sequence();
    Ok(current_ledger >= started_ledger + required_ledgers)
}
