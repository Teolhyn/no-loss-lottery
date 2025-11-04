<img width="992" height="290" alt="image" src="https://github.com/user-attachments/assets/fd0420d7-cbc0-4438-a3c1-1d82c4305119" />
# No Loss Lottery

This is a No Loss Lottery dApp built on [Stellar blockchain](https://stellar.org/) using [Blend](https://blend.capital/) for yield generation. This project was built for the [Stellar Scaffold Hackathon](https://dorahacks.io/hackathon/scaffoldstellar/detail), in which the theme was first, to use the [Stellar Scaffold](https://scaffoldstellar.org) as the starting point of the dApp, and second to use the [Stellar Wallets Kit](https://stellarwalletskit.dev/) for wallet integration.

## Overview of No Loss Lottery

No Loss Lottery works by generating yield for the prizes from users funds which have been stored in to the smart contract from ticket purchases. Tickets have a fixed price and each ticket has an equal chance of winning. However, there is no limit on how many tickets a single user can buy.

The whole protocol is built to be trustless and decentralized, therefore all of the functions, including moving funds from No Loss Lottery contract to Blend and back, can be called by anyone. For such system to work, the contract has different statuses that allow a different set of functions to be called. So that the aforementioned statuses would not be abused, timelocks were implemented on when the change from a status to another can be executed.

## Smart Contract Functions

```rust
buy_ticket(e: Env, user: Address) -> Result<Ticket, LotteryError>
```

`buy_ticket` buys an ticket for the `user` for the set constant price ($10 USDC) stored in contract storage. Funds are moved from the `user` address to the No Loss Lottery contract. Only callable when the `LotteryStatus` is set to `BuyIn`.

```rust
redeem_ticket(e: Env, ticket: Ticket) -> Result<(), LotteryError>
```

`redeem_ticket` returns the users funds from the contract for the given `Ticket`. If the ticket has won the `Ticket.amount` includes the prize and the buy-in price. Only callable when the `LotteryStatus` is set to `BuyIn` or `Ended`.

```rust
raffle(e: Env) -> Result<Ticket, LotteryError>
```

`raffle` randomly selects an winning `Ticket.id` from the existing ids. After selecting, the function sets the `Ticket.amount` to include the prize yield. Finally the function sets `WinnerSelected = true`. Only callable when the `LotteryStatus` is set to `Ended` and `LotteryState.in_blender == false` and `WinnerSelected == false`.

```rust
set_status(e: Env, new_status: LotteryStatus) -> Result<(), LotteryError>
```

`set_status` updates the status of the contract. Possible changes are 1.`BuyIn -> YieldFarming`, 2.`YieldFarming -> Ended`, and 3.`Ended -> Buyin`. Changes are allowed only if enough time has passed since last change. The times in ledgers are `MIN_BUYIN_TIME_IN_LEDGERS`, `MIN_YIELD_TIME_IN_LEDGERS`, and `MIN_ENDED_TIME_IN_LEDGERS`, for transitions 1., 2., and 3. respectively.

```rust
blend_it(e: Env) -> Result<(), LotteryError>
```

`blend_it` moves all of the No Loss Lottery contracts funds to Blend USDC pool. It also sets `LotteryState.in_blender == true`. Only callable when `LotteryStatus` is set to `YieldFarming`.

```rust
withdraw_from_blend(e: Env) -> Result<i128, LotteryError>
```

`withdraw_from_blend` withdraws all of the funds and generated yield from Blend. It also sets `LotteryState.in_blender == false`. Finally, it sets `LotteryState.amount_of_yield` to the value of yield gained during the farming time. Only callable when `LotteryStatus` is set to `Ended`.

```rust
admin_claim_emissions(e: &Env) -> Result<(), LotteryError>
```

`admin_claim_emissions` claims emissions from Blend pool, transfers them to contract and from there to admin address. NOTE: Implementation is still under development and untested.
