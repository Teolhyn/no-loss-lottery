use soroban_sdk::contracterror;

#[derive(Debug)]
#[contracterror]
#[repr(u32)]
pub enum LotteryError {
    WrongStatus = 1,
    LotteryStatusNotFound = 2,
    LotteryCurrencyNotFound = 3,
    TokenAmountNotFound = 4,
    LotteryStateNotFound = 5,
    TicketNotFound = 6,
    AlreadyInitialized = 7,
    NotAuthorized = 8,
    SentToBlendNotFound = 9,
    BlenderNotFound = 10,
    AdminNotFound = 11,
    BlendPositionNotFound = 12,
    IdsNotFound = 13,
}
