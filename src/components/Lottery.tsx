import { useState, useEffect, useMemo, useCallback } from "react";
import { useWallet } from "../hooks/useWallet";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { useNotification } from "../hooks/useNotification";
import lotteryContract from "../contracts/no_loss_lottery";
import * as NoLossLottery from "no_loss_lottery";
import { rpcUrl } from "../contracts/util";
import { Address } from "@stellar/stellar-sdk";

// Matrix Terminal Theme CSS
const matrixStyles = `
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    41.99% { opacity: 1; }
    42% { opacity: 0.8; }
    43% { opacity: 1; }
    45.99% { opacity: 1; }
    46% { opacity: 0.7; }
    46.5% { opacity: 1; }
  }

  .matrix-container {
    background: #000000;
    color: #00FF00;
    font-family: 'Courier New', 'IBM Plex Mono', 'Monaco', monospace;
    min-height: 100vh;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .matrix-container::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to bottom, rgba(0, 255, 0, 0.8) 0%, transparent 100%);
    animation: scanline 8s linear infinite;
    z-index: 10;
    pointer-events: none;
  }

  .matrix-container::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 255, 0, 0.03) 0px,
      transparent 1px,
      transparent 2px,
      rgba(0, 255, 0, 0.03) 3px
    );
    pointer-events: none;
    z-index: 9;
    animation: flicker 0.15s infinite;
  }

  .matrix-card {
    background: rgba(0, 20, 0, 0.95) !important;
    border: 2px solid #00FF00 !important;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.05) !important;
    border-radius: 0 !important;
    padding: 20px !important;
    margin-bottom: 20px;
    position: relative;
  }

  .matrix-text {
    color: #00FF00 !important;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
    font-family: 'Courier New', monospace !important;
    letter-spacing: 1px;
  }

  .matrix-text-dim {
    color: #00AA00 !important;
    text-shadow: 0 0 3px rgba(0, 255, 0, 0.4);
    font-family: 'Courier New', monospace !important;
  }

  .matrix-title {
    color: #00FF00 !important;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
    font-family: 'Courier New', monospace !important;
    font-weight: bold !important;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .matrix-button {
    background: #000000 !important;
    color: #00FF00 !important;
    border: 2px solid #00FF00 !important;
    font-family: 'Courier New', monospace !important;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 10px 20px !important;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  }

  .matrix-button:hover:not(:disabled) {
    background: #00FF00 !important;
    color: #000000 !important;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
  }

  .matrix-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .matrix-button-active {
    background: #00FF00 !important;
    color: #000000 !important;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
  }

  .matrix-ticket {
    background: rgba(0, 40, 0, 0.8) !important;
    border: 1px solid #00AA00 !important;
    padding: 15px;
    margin-bottom: 10px;
  }

  .matrix-ticket-winner {
    background: rgba(0, 80, 0, 0.9) !important;
    border: 2px solid #00FF00 !important;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
    animation: flicker 2s infinite;
  }

  .matrix-status-buyin {
    color: #00FF00 !important;
    text-shadow: 0 0 10px rgba(0, 255, 0, 1);
  }

  .matrix-status-farming {
    color: #FFFF00 !important;
    text-shadow: 0 0 10px rgba(255, 255, 0, 0.8);
  }

  .matrix-status-ended {
    color: #FF0000 !important;
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
  }

  .matrix-border-top {
    border-top: 1px solid #00FF00;
    margin: 15px 0;
    opacity: 0.5;
  }

  .cursor-blink::after {
    content: "█";
    animation: blink 1s infinite;
    margin-left: 2px;
  }
`;

// Lottery status enum matching the contract
enum LotteryStatus {
  BuyIn = "BuyIn",
  YieldFarming = "YieldFarming",
  Ended = "Ended",
}

interface Ticket {
  id: number;
  user: string;
  token: string;
  amount: bigint;
  won: boolean;
}

interface LotteryState {
  status: LotteryStatus;
  no_participants: number;
  amount_of_yield: bigint;
  token: string;
}

export const Lottery = () => {
  const [lotteryState, setLotteryState] = useState<LotteryState | null>(null);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [winningTicket, setWinningTicket] = useState<Ticket | null>(null);
  const [adminAddress, setAdminAddress] = useState<string | null>(null);

  const { address, signTransaction } = useWallet();
  const { isFunded } = useWalletBalance();
  const { addNotification } = useNotification();

  // Create a lottery client with the user's wallet
  const lottery = useMemo(() => {
    if (!address || !signTransaction) {
      return lotteryContract;
    }

    return new NoLossLottery.Client({
      networkPassphrase: "Test SDF Network ; September 2015",
      contractId: lotteryContract.options.contractId,
      rpcUrl,
      allowHttp: false,
      publicKey: address,
      signTransaction,
    });
  }, [address, signTransaction]);

  // Load user tickets from contract
  const loadUserTickets = useCallback(async () => {
    if (!address) {
      setMyTickets([]);
      return;
    }

    try {
      const ticketsResult = await lotteryContract.get_user_tickets({
        user: address,
      });

      if (ticketsResult.result.isOk()) {
        const tickets = ticketsResult.result.unwrap();
        const formattedTickets: Ticket[] = tickets.map((ticket) => ({
          id: ticket.id,
          user: ticket.user,
          token: ticket.token,
          amount: BigInt(ticket.amount.toString()),
          won: ticket.won,
        }));
        setMyTickets(formattedTickets);
      }
    } catch (error) {
      console.error("Error loading user tickets:", error);
    }
  }, [address]);

  // Load lottery state from contract
  useEffect(() => {
    const loadLotteryData = async () => {
      try {
        setIsLoading(true);

        const stateResult = await lotteryContract.get_lottery_state();
        if (stateResult.result.isOk()) {
          const state = stateResult.result.unwrap();
          const statusTag =
            typeof state.status === "object" && state.status.tag
              ? state.status.tag
              : state.status;
          setLotteryState({
            status: statusTag as LotteryStatus,
            no_participants: state.no_participants,
            amount_of_yield: BigInt(state.amount_of_yield.toString()),
            token: state.token,
          });
        }

        const adminTx = await lotteryContract.get_admin();
        const simulation = adminTx.simulation as
          | { result?: { retval?: unknown } }
          | undefined;
        const adminScVal = simulation?.result?.retval;

        let adminAddressStr = null;
        if (
          adminScVal &&
          typeof adminScVal === "object" &&
          "_arm" in adminScVal &&
          adminScVal._arm === "address" &&
          "_value" in adminScVal
        ) {
          try {
            const scAddress = adminScVal._value as Parameters<
              typeof Address.fromScAddress
            >[0];
            const adminAddr = Address.fromScAddress(scAddress);
            adminAddressStr = adminAddr.toString();
          } catch (e) {
            console.error("Failed to convert admin address:", e);
          }
        }
        setAdminAddress(adminAddressStr);

        await loadUserTickets();
      } catch (error) {
        console.error("Error loading lottery data:", error);
        addNotification("Failed to load lottery data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    void loadLotteryData();
  }, [addNotification, address, loadUserTickets]);

  const buyTicket = async () => {
    if (!address) return;

    setIsSubmitting(true);
    try {
      const tx = await lottery.buy_ticket({ user: address });
      const response = await tx.signAndSend();

      if (response.result.isErr()) {
        const error = response.result.unwrapErr();
        addNotification(`Error: ${JSON.stringify(error)}`, "error");
      } else {
        addNotification("Ticket purchased successfully!", "success");
        await loadUserTickets();
      }
    } catch (error) {
      addNotification("Failed to buy ticket", "error");
      console.error("Buy ticket error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const redeemTicket = async (ticket: Ticket) => {
    setIsSubmitting(true);
    try {
      const tx = await lottery.redeem_ticket({ ticket });
      const response = await tx.signAndSend();

      if (response.result.isErr()) {
        const error = response.result.unwrapErr();
        addNotification(`Error: ${JSON.stringify(error)}`, "error");
      } else {
        addNotification(
          ticket.won
            ? "Congratulations! Redeemed ticket + yield!"
            : "Ticket redeemed successfully",
          "success",
        );
        await loadUserTickets();
      }
    } catch (error) {
      addNotification("Failed to redeem ticket", "error");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const runRaffle = async () => {
    setIsSubmitting(true);
    try {
      const tx = await lottery.raffle({});
      const response = await tx.signAndSend();

      if (response.result.isErr()) {
        const error = response.result.unwrapErr();
        addNotification(`Error: ${JSON.stringify(error)}`, "error");
      } else {
        const winner = response.result.unwrap();
        const winnerTicket: Ticket = {
          id: winner.id,
          user: winner.user,
          token: winner.token,
          amount: BigInt(winner.amount.toString()),
          won: winner.won,
        };
        setWinningTicket(winnerTicket);
        addNotification(`Ticket #${winner.id} won the lottery!`, "success");

        await loadUserTickets();
      }
    } catch (error) {
      addNotification("Failed to run raffle", "error");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeStatus = async (newStatus: LotteryStatus) => {
    if (!address || !adminAddress) {
      addNotification("Admin address not found", "error");
      return;
    }

    if (String(address).toLowerCase() !== String(adminAddress).toLowerCase()) {
      addNotification("Only admin can change status", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const statusEnum = { tag: newStatus, values: undefined };

      const tx = await lottery.set_status({
        admin: address,
        new_status: statusEnum,
      });
      const response = await tx.signAndSend();

      if (response.result.isErr()) {
        const error = response.result.unwrapErr();
        addNotification(`Error: ${JSON.stringify(error)}`, "error");
      } else {
        setLotteryState({ ...lotteryState, status: newStatus });
        addNotification(`Status changed to ${newStatus}`, "success");
      }
    } catch (error) {
      addNotification("Failed to change status", "error");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClass = () => {
    switch (lotteryState?.status) {
      case LotteryStatus.BuyIn:
        return "matrix-status-buyin";
      case LotteryStatus.YieldFarming:
        return "matrix-status-farming";
      case LotteryStatus.Ended:
        return "matrix-status-ended";
      default:
        return "";
    }
  };

  const ticketAmountXLM = 1;
  const isAdmin =
    address &&
    adminAddress &&
    address.toLowerCase() === adminAddress.toLowerCase();

  if (!address) {
    return (
      <div className="matrix-container">
        <style>{matrixStyles}</style>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="matrix-card">
            <div className="matrix-title" style={{ marginBottom: "20px" }}>
              ╔═══════════════════════════════════╗
              <br />
              ║ NO-LOSS LOTTERY PROTOCOL V1.0 ║
              <br />
              ╚═══════════════════════════════════╝
            </div>
            <div className="matrix-text">
              &gt; ACCESS DENIED
              <br />
              &gt; WALLET CONNECTION REQUIRED
              <br />
              &gt; PLEASE AUTHENTICATE TO CONTINUE
              <span className="cursor-blink"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isFunded) {
    return (
      <div className="matrix-container">
        <style>{matrixStyles}</style>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="matrix-card">
            <div className="matrix-title" style={{ marginBottom: "20px" }}>
              ╔═══════════════════════════════════╗
              <br />
              ║ NO-LOSS LOTTERY PROTOCOL V1.0 ║
              <br />
              ╚═══════════════════════════════════╝
            </div>
            <div className="matrix-text">
              &gt; WALLET DETECTED: {address.substring(0, 12)}...
              <br />
              &gt; ERROR: INSUFFICIENT FUNDS
              <br />
              &gt; PLEASE FUND YOUR ACCOUNT TO PROCEED
              <span className="cursor-blink"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !lotteryState) {
    return (
      <div className="matrix-container">
        <style>{matrixStyles}</style>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="matrix-card">
            <div className="matrix-title" style={{ marginBottom: "20px" }}>
              ╔═══════════════════════════════════╗
              <br />
              ║ NO-LOSS LOTTERY PROTOCOL V1.0 ║
              <br />
              ╚═══════════════════════════════════╝
            </div>
            <div className="matrix-text">
              &gt; CONNECTING TO BLOCKCHAIN...
              <br />
              &gt; DECRYPTING CONTRACT STATE...
              <br />
              &gt; LOADING DATA
              <span className="cursor-blink"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="matrix-container">
      <style>{matrixStyles}</style>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div className="matrix-card">
          <div className="matrix-title" style={{ marginBottom: "20px" }}>
            ╔═══════════════════════════════════╗
            <br />
            ║ NO-LOSS LOTTERY PROTOCOL V1.0 ║
            <br />
            ╚═══════════════════════════════════╝
          </div>
          <div className="matrix-text" style={{ marginBottom: "10px" }}>
            &gt; STATUS:{" "}
            <span className={getStatusClass()}>[{lotteryState.status}]</span>
          </div>
          <div className="matrix-text-dim" style={{ marginBottom: "5px" }}>
            &gt; PARTICIPANTS: {lotteryState.no_participants}
          </div>
          <div className="matrix-text-dim">
            &gt; TOTAL_YIELD:{" "}
            {(Number(lotteryState.amount_of_yield) / 10000000).toFixed(7)} XLM
          </div>
          <div className="matrix-border-top"></div>
          <div className="matrix-text-dim" style={{ fontSize: "0.85rem" }}>
            {lotteryState.status === LotteryStatus.BuyIn &&
              "&gt; Phase active: Ticket purchases enabled"}
            {lotteryState.status === LotteryStatus.YieldFarming &&
              "&gt; Yield farming in progress... please wait"}
            {lotteryState.status === LotteryStatus.Ended &&
              "&gt; Lottery complete. Execute raffle protocol."}
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div
            className="matrix-card"
            style={{
              borderColor: "#FFFF00",
              boxShadow: "0 0 20px rgba(255, 255, 0, 0.3)",
            }}
          >
            <div
              className="matrix-title"
              style={{
                marginBottom: "15px",
                color: "#FFFF00",
                textShadow: "0 0 10px rgba(255, 255, 0, 0.8)",
              }}
            >
              [ADMIN_ACCESS_GRANTED]
            </div>
            <div
              className="matrix-text"
              style={{ marginBottom: "15px", color: "#FFFF00" }}
            >
              &gt; CHANGE_LOTTERY_STATUS:
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                className={`matrix-button ${lotteryState.status === LotteryStatus.BuyIn ? "matrix-button-active" : ""}`}
                onClick={() => void changeStatus(LotteryStatus.BuyIn)}
                disabled={isSubmitting}
              >
                [BUY_IN]
              </button>
              <button
                type="button"
                className={`matrix-button ${lotteryState.status === LotteryStatus.YieldFarming ? "matrix-button-active" : ""}`}
                onClick={() => void changeStatus(LotteryStatus.YieldFarming)}
                disabled={isSubmitting}
              >
                [FARMING]
              </button>
              <button
                type="button"
                className={`matrix-button ${lotteryState.status === LotteryStatus.Ended ? "matrix-button-active" : ""}`}
                onClick={() => void changeStatus(LotteryStatus.Ended)}
                disabled={isSubmitting}
              >
                [END]
              </button>
            </div>
          </div>
        )}

        {/* Buy Ticket */}
        <div className="matrix-card">
          <div
            className="matrix-title"
            style={{ marginBottom: "15px", fontSize: "1.1rem" }}
          >
            [PURCHASE_TICKET]
          </div>
          <div
            className="matrix-text-dim"
            style={{ marginBottom: "15px", fontSize: "0.9rem" }}
          >
            &gt; Submit {ticketAmountXLM} XLM to enter lottery pool
            <br />
            &gt; Funds returned regardless of outcome
            <br />
            &gt; One winner receives all yield
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div className="matrix-text">&gt; COST: {ticketAmountXLM} XLM</div>
            <button
              type="button"
              className="matrix-button"
              onClick={() => void buyTicket()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "[PROCESSING...]" : "[EXECUTE]"}
            </button>
          </div>
        </div>

        {/* My Tickets */}
        {myTickets.length > 0 && (
          <div className="matrix-card">
            <div className="matrix-title" style={{ marginBottom: "15px" }}>
              [YOUR_TICKETS] ({myTickets.length})
            </div>
            {myTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={
                  ticket.won
                    ? "matrix-ticket matrix-ticket-winner"
                    : "matrix-ticket"
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div className="matrix-text">
                      &gt; TICKET_ID: #{ticket.id}{" "}
                      {ticket.won && "[***WINNER***]"}
                    </div>
                    <div
                      className="matrix-text-dim"
                      style={{ fontSize: "0.85rem" }}
                    >
                      &gt; AMOUNT:{" "}
                      {(Number(ticket.amount) / 10000000).toFixed(7)} XLM
                    </div>
                  </div>
                  <button
                    type="button"
                    className="matrix-button"
                    onClick={() => void redeemTicket(ticket)}
                    disabled={isSubmitting}
                    style={{ fontSize: "0.85rem", padding: "8px 15px" }}
                  >
                    [REDEEM]
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Raffle */}
        {lotteryState.status === LotteryStatus.Ended && isAdmin && (
          <div className="matrix-card">
            <div className="matrix-title" style={{ marginBottom: "15px" }}>
              [EXECUTE_RAFFLE]
            </div>
            <div className="matrix-text-dim" style={{ marginBottom: "15px" }}>
              &gt; Lottery phase complete
              <br />
              &gt; Execute random winner selection protocol
            </div>
            <button
              type="button"
              className="matrix-button"
              onClick={() => void runRaffle()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "[PROCESSING...]" : "[RUN_RAFFLE]"}
            </button>
            {winningTicket && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  border: "2px solid #00FF00",
                  background: "rgba(0, 80, 0, 0.5)",
                }}
              >
                <div
                  className="matrix-text"
                  style={{ fontSize: "1.1rem", marginBottom: "10px" }}
                >
                  *** WINNER_SELECTED ***
                </div>
                <div className="matrix-text">
                  &gt; TICKET_ID: #{winningTicket.id}
                  <br />
                  &gt; REWARD: DEPOSIT + YIELD
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="matrix-card">
          <div className="matrix-title" style={{ marginBottom: "15px" }}>
            [PROTOCOL_INFO]
          </div>
          <div
            className="matrix-text-dim"
            style={{ fontSize: "0.9rem", lineHeight: "1.8" }}
          >
            &gt; [1] BUY_IN_PERIOD: Purchase tickets with XLM
            <br />
            &gt; [2] YIELD_FARMING: Funds generate yield via DeFi
            <br />
            &gt; [3] LOTTERY_ENDS: Random winner selection
            <br />
            &gt; [4] WINNER: Receives deposit + all yield
            <br />
            &gt; [5] OTHERS: Full deposit returned (no loss)
          </div>
        </div>
      </div>
    </div>
  );
};
