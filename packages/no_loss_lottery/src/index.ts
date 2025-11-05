import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  unknown: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: "CDID2FBEZOSICXXQ25NBJFFS5MT3JWYOD3P6D3HCJGTXOFIQZZD42TJH",
  }
} as const

export const LotteryError = {
  1: {message:"WrongStatus"},
  2: {message:"LotteryStatusNotFound"},
  3: {message:"LotteryCurrencyNotFound"},
  4: {message:"TokenAmountNotFound"},
  5: {message:"LotteryStateNotFound"},
  6: {message:"TicketNotFound"},
  7: {message:"AlreadyInitialized"},
  8: {message:"NotAuthorized"},
  9: {message:"SentToBlendNotFound"},
  10: {message:"BlenderNotFound"},
  11: {message:"AdminNotFound"},
  12: {message:"BlendPositionNotFound"},
  13: {message:"IdsNotFound"},
  14: {message:"WinnerSelectedNotFound"},
  15: {message:"WinnerAlreadySelected"},
  16: {message:"BalancesInBlender"},
  17: {message:"SeedNotFound"},
  18: {message:"FarmingStartedLedgerNotFound"},
  19: {message:"BuyInStartedLedgerNotFound"},
  20: {message:"EndedStartedLedgerNotFound"},
  21: {message:"MinimumTimeLockNotEnded"}
}

export type LotteryStatus = {tag: "BuyIn", values: void} | {tag: "YieldFarming", values: void} | {tag: "Ended", values: void};


export interface LotteryState {
  amount_of_yield: i128;
  in_blender: boolean;
  no_participants: u32;
  status: LotteryStatus;
  token: string;
}


export interface Ticket {
  amount: i128;
  id: u32;
  token: string;
  user: string;
  won: boolean;
}

export interface Client {
  /**
   * Construct and simulate a buy_ticket transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  buy_ticket: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<Ticket>>>

  /**
   * Construct and simulate a redeem_ticket transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  redeem_ticket: ({ticket}: {ticket: Ticket}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a raffle transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  raffle: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<Ticket>>>

  /**
   * Construct and simulate a set_status transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_status: ({new_status}: {new_status: LotteryStatus}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_lottery_state transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_lottery_state: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<LotteryState>>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a get_ticket_amount transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_ticket_amount: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a get_contract_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_contract_balance: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a get_user_tickets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_user_tickets: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<Array<Ticket>>>>

  /**
   * Construct and simulate a get_current_ledger transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_current_ledger: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_status_started_ledger transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_status_started_ledger: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<u32>>>

  /**
   * Construct and simulate a blend_it transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  blend_it: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a withdraw_from_blend transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_from_blend: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a admin_claim_emissions transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  admin_claim_emissions: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin, token, ticket_amount, blend_address}: {admin: string, token: string, ticket_amount: i128, blend_address: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({admin, token, ticket_amount, blend_address}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAQAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAA10aWNrZXRfYW1vdW50AAAAAAAACwAAAAAAAAANYmxlbmRfYWRkcmVzcwAAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAKYnV5X3RpY2tldAAAAAAAAQAAAAAAAAAEdXNlcgAAABMAAAABAAAD6QAAB9AAAAAGVGlja2V0AAAAAAfQAAAADExvdHRlcnlFcnJvcg==",
        "AAAAAAAAAAAAAAANcmVkZWVtX3RpY2tldAAAAAAAAAEAAAAAAAAABnRpY2tldAAAAAAH0AAAAAZUaWNrZXQAAAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADExvdHRlcnlFcnJvcg==",
        "AAAAAAAAAAAAAAAGcmFmZmxlAAAAAAAAAAAAAQAAA+kAAAfQAAAABlRpY2tldAAAAAAH0AAAAAxMb3R0ZXJ5RXJyb3I=",
        "AAAAAAAAAAAAAAAKc2V0X3N0YXR1cwAAAAAAAQAAAAAAAAAKbmV3X3N0YXR1cwAAAAAH0AAAAA1Mb3R0ZXJ5U3RhdHVzAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAMTG90dGVyeUVycm9y",
        "AAAAAAAAAAAAAAARZ2V0X2xvdHRlcnlfc3RhdGUAAAAAAAAAAAAAAQAAA+kAAAfQAAAADExvdHRlcnlTdGF0ZQAAB9AAAAAMTG90dGVyeUVycm9y",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAPoAAAAEw==",
        "AAAAAAAAAAAAAAARZ2V0X3RpY2tldF9hbW91bnQAAAAAAAAAAAAAAQAAA+kAAAALAAAH0AAAAAxMb3R0ZXJ5RXJyb3I=",
        "AAAAAAAAAAAAAAAUZ2V0X2NvbnRyYWN0X2JhbGFuY2UAAAAAAAAAAQAAA+kAAAALAAAH0AAAAAxMb3R0ZXJ5RXJyb3I=",
        "AAAAAAAAAAAAAAAQZ2V0X3VzZXJfdGlja2V0cwAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAA+kAAAPqAAAH0AAAAAZUaWNrZXQAAAAAB9AAAAAMTG90dGVyeUVycm9y",
        "AAAAAAAAAAAAAAASZ2V0X2N1cnJlbnRfbGVkZ2VyAAAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAZZ2V0X3N0YXR1c19zdGFydGVkX2xlZGdlcgAAAAAAAAAAAAABAAAD6QAAAAQAAAfQAAAADExvdHRlcnlFcnJvcg==",
        "AAAAAAAAAAAAAAAIYmxlbmRfaXQAAAAAAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAMTG90dGVyeUVycm9y",
        "AAAAAAAAAAAAAAATd2l0aGRyYXdfZnJvbV9ibGVuZAAAAAAAAAAAAQAAA+kAAAALAAAH0AAAAAxMb3R0ZXJ5RXJyb3I=",
        "AAAAAAAAAAAAAAAVYWRtaW5fY2xhaW1fZW1pc3Npb25zAAAAAAAAAAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADExvdHRlcnlFcnJvcg==",
        "AAAABAAAAAAAAAAAAAAADExvdHRlcnlFcnJvcgAAABUAAAAAAAAAC1dyb25nU3RhdHVzAAAAAAEAAAAAAAAAFUxvdHRlcnlTdGF0dXNOb3RGb3VuZAAAAAAAAAIAAAAAAAAAF0xvdHRlcnlDdXJyZW5jeU5vdEZvdW5kAAAAAAMAAAAAAAAAE1Rva2VuQW1vdW50Tm90Rm91bmQAAAAABAAAAAAAAAAUTG90dGVyeVN0YXRlTm90Rm91bmQAAAAFAAAAAAAAAA5UaWNrZXROb3RGb3VuZAAAAAAABgAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAAHAAAAAAAAAA1Ob3RBdXRob3JpemVkAAAAAAAACAAAAAAAAAATU2VudFRvQmxlbmROb3RGb3VuZAAAAAAJAAAAAAAAAA9CbGVuZGVyTm90Rm91bmQAAAAACgAAAAAAAAANQWRtaW5Ob3RGb3VuZAAAAAAAAAsAAAAAAAAAFUJsZW5kUG9zaXRpb25Ob3RGb3VuZAAAAAAAAAwAAAAAAAAAC0lkc05vdEZvdW5kAAAAAA0AAAAAAAAAFldpbm5lclNlbGVjdGVkTm90Rm91bmQAAAAAAA4AAAAAAAAAFVdpbm5lckFscmVhZHlTZWxlY3RlZAAAAAAAAA8AAAAAAAAAEUJhbGFuY2VzSW5CbGVuZGVyAAAAAAAAEAAAAAAAAAAMU2VlZE5vdEZvdW5kAAAAEQAAAAAAAAAcRmFybWluZ1N0YXJ0ZWRMZWRnZXJOb3RGb3VuZAAAABIAAAAAAAAAGkJ1eUluU3RhcnRlZExlZGdlck5vdEZvdW5kAAAAAAATAAAAAAAAABpFbmRlZFN0YXJ0ZWRMZWRnZXJOb3RGb3VuZAAAAAAAFAAAAAAAAAAXTWluaW11bVRpbWVMb2NrTm90RW5kZWQAAAAAFQ==",
        "AAAAAgAAAAAAAAAAAAAADUxvdHRlcnlTdGF0dXMAAAAAAAADAAAAAAAAAAAAAAAFQnV5SW4AAAAAAAAAAAAAAAAAAAxZaWVsZEZhcm1pbmcAAAAAAAAAAAAAAAVFbmRlZAAAAA==",
        "AAAAAQAAAAAAAAAAAAAADExvdHRlcnlTdGF0ZQAAAAUAAAAAAAAAD2Ftb3VudF9vZl95aWVsZAAAAAALAAAAAAAAAAppbl9ibGVuZGVyAAAAAAABAAAAAAAAAA9ub19wYXJ0aWNpcGFudHMAAAAABAAAAAAAAAAGc3RhdHVzAAAAAAfQAAAADUxvdHRlcnlTdGF0dXMAAAAAAAAAAAAABXRva2VuAAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAABlRpY2tldAAAAAAABQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAJpZAAAAAAABAAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAADd29uAAAAAAE=" ]),
      options
    )
  }
  public readonly fromJSON = {
    buy_ticket: this.txFromJSON<Result<Ticket>>,
        redeem_ticket: this.txFromJSON<Result<void>>,
        raffle: this.txFromJSON<Result<Ticket>>,
        set_status: this.txFromJSON<Result<void>>,
        get_lottery_state: this.txFromJSON<Result<LotteryState>>,
        get_admin: this.txFromJSON<Option<string>>,
        get_ticket_amount: this.txFromJSON<Result<i128>>,
        get_contract_balance: this.txFromJSON<Result<i128>>,
        get_user_tickets: this.txFromJSON<Result<Array<Ticket>>>,
        get_current_ledger: this.txFromJSON<u32>,
        get_status_started_ledger: this.txFromJSON<Result<u32>>,
        blend_it: this.txFromJSON<Result<void>>,
        withdraw_from_blend: this.txFromJSON<Result<i128>>,
        admin_claim_emissions: this.txFromJSON<Result<void>>
  }
}