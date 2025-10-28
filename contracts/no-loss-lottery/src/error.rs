use soroban_sdk::contracterror;

#[contracterror]
#[repr(u32)]
pub enum LotteryError {
    WrongStatus = 1,
    LotteryStatusNotFound = 2,
    LotteryCurrencyNotFound = 3,
    TokenAmountNotFound = 4,
    LotteryStateNotFound = 5,
    TicketNotFound = 6,
}
