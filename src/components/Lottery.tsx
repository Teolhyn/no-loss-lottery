import { useState, useEffect, useMemo, useCallback } from "react";
import { useWallet } from "../hooks/useWallet";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { useNotification } from "../hooks/useNotification";
import lotteryContract from "../contracts/no_loss_lottery";
import * as NoLossLottery from "no_loss_lottery";
import { rpcUrl } from "../contracts/util";
import { Address } from "@stellar/stellar-sdk";

// Vaporwave Theme CSS
const vaporwaveStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes glow-pulse {
    0%, 100% {
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.5),
                  0 0 40px rgba(0, 255, 255, 0.3),
                  inset 0 0 20px rgba(255, 0, 255, 0.1);
    }
    50% {
      box-shadow: 0 0 40px rgba(255, 0, 255, 0.8),
                  0 0 60px rgba(0, 255, 255, 0.6),
                  inset 0 0 30px rgba(255, 0, 255, 0.2);
    }
  }

  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }

  .vaporwave-container {
    background: linear-gradient(135deg, #1a0033 0%, #330066 25%, #0d1b2a 50%, #1b263b 75%, #0d0d2b 100%);
    background-size: 400% 400%;
    animation: gradient-shift 15s ease infinite;
    color: #FF00FF;
    font-family: 'Orbitron', sans-serif;
    min-height: 100vh;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .vaporwave-container::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      repeating-linear-gradient(
        0deg,
        rgba(255, 0, 255, 0.03) 0px,
        transparent 2px,
        transparent 4px,
        rgba(255, 0, 255, 0.03) 6px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(0, 255, 255, 0.03) 0px,
        transparent 2px,
        transparent 4px,
        rgba(0, 255, 255, 0.03) 6px
      );
    pointer-events: none;
    z-index: 1;
  }

  .vaporwave-content {
    position: relative;
    z-index: 2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .vaporwave-header {
    text-align: center;
    margin-bottom: 40px;
    animation: float 3s ease-in-out infinite;
  }

  .vaporwave-title {
    font-size: 4rem;
    font-weight: 900;
    margin: 0;
    background: linear-gradient(90deg, #FF00FF, #00FFFF, #FF00FF);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 3s linear infinite;
    text-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
    letter-spacing: 8px;
  }

  .vaporwave-subtitle {
    font-size: 1.2rem;
    color: #00FFFF;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
    letter-spacing: 6px;
    margin-top: 10px;
  }

  .vaporwave-card {
    background: rgba(26, 0, 51, 0.6);
    border: 2px solid;
    border-image: linear-gradient(135deg, #FF00FF, #00FFFF, #FF1493) 1;
    padding: 30px;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
    animation: glow-pulse 3s ease-in-out infinite;
    position: relative;
  }

  .vaporwave-card::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #FF00FF, #00FFFF, #FF1493, #FF00FF);
    background-size: 300% 300%;
    animation: gradient-shift 4s ease infinite;
    z-index: -1;
    opacity: 0.3;
    filter: blur(10px);
  }

  .vaporwave-label {
    font-size: 0.9rem;
    color: #00FFFF;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 10px;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  .vaporwave-value {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(90deg, #FF00FF, #FF1493, #00FFFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
  }

  .vaporwave-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 20px 0;
  }

  .vaporwave-stat {
    background: rgba(255, 0, 255, 0.1);
    border: 1px solid #FF00FF;
    padding: 20px;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
  }

  .vaporwave-stat-label {
    font-size: 0.8rem;
    color: #00FFFF;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }

  .vaporwave-stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #FF00FF;
    text-shadow: 0 0 10px rgba(255, 0, 255, 0.8);
  }

  .vaporwave-button {
    background: linear-gradient(135deg, #FF00FF, #FF1493);
    color: #FFFFFF;
    border: 2px solid #00FFFF;
    font-family: 'Orbitron', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 18px 40px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.5), 0 5px 15px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
  }

  .vaporwave-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  .vaporwave-button:hover:not(:disabled)::before {
    left: 100%;
  }

  .vaporwave-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #00FFFF, #FF00FF);
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 5px 20px rgba(0, 0, 0, 0.5);
    transform: translateY(-2px);
  }

  .vaporwave-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .vaporwave-button:disabled {
    background: rgba(100, 100, 100, 0.3);
    border-color: #666666;
    color: #999999;
    cursor: not-allowed;
    box-shadow: none;
  }

  .vaporwave-button-cyan {
    background: linear-gradient(135deg, #00FFFF, #0099FF);
    border-color: #FF00FF;
  }

  .vaporwave-button-cyan:hover:not(:disabled) {
    background: linear-gradient(135deg, #FF00FF, #00FFFF);
  }

  .vaporwave-button-active {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
    animation: rainbow 3s linear infinite;
  }

  .vaporwave-ticket {
    background: rgba(0, 255, 255, 0.1);
    border: 2px solid #00FFFF;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    transition: all 0.3s ease;
  }

  .vaporwave-ticket:hover {
    transform: translateX(5px);
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.5);
  }

  .vaporwave-ticket-winner {
    background: rgba(255, 0, 255, 0.2);
    border: 3px solid #FF00FF;
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.6);
    animation: glow-pulse 2s ease-in-out infinite;
  }

  .vaporwave-ticket-id {
    font-size: 1.5rem;
    font-weight: 700;
    color: #FF00FF;
    text-shadow: 0 0 10px rgba(255, 0, 255, 0.8);
  }

  .vaporwave-ticket-amount {
    font-size: 0.9rem;
    color: #00FFFF;
    margin-top: 5px;
  }

  .vaporwave-text {
    color: #00FFFF;
    line-height: 1.8;
    margin: 15px 0;
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  }

  .vaporwave-status-buyin {
    color: #00FF00;
    text-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
  }

  .vaporwave-status-farming {
    color: #FFD700;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }

  .vaporwave-status-ended {
    color: #FF1493;
    text-shadow: 0 0 20px rgba(255, 20, 147, 0.8);
  }

  .vaporwave-winner-box {
    background: rgba(255, 0, 255, 0.2);
    border: 3px solid #FF00FF;
    border-radius: 15px;
    padding: 30px;
    margin-top: 20px;
    text-align: center;
    animation: glow-pulse 2s ease-in-out infinite;
  }

  .vaporwave-winner-text {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(90deg, #FF00FF, #FFD700, #00FFFF, #FF00FF);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 2s linear infinite;
  }

  @media (max-width: 768px) {
    .vaporwave-title {
      font-size: 2.5rem;
    }

    .vaporwave-grid {
      grid-template-columns: 1fr;
    }

    .vaporwave-winner-text {
      font-size: 2rem;
    }
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
        return "vaporwave-status-buyin";
      case LotteryStatus.YieldFarming:
        return "vaporwave-status-farming";
      case LotteryStatus.Ended:
        return "vaporwave-status-ended";
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
      <div className="vaporwave-container">
        <style>{vaporwaveStyles}</style>
        <div className="vaporwave-content">
          <div className="vaporwave-header">
            <div className="vaporwave-title">NO LOSS LOTTERY</div>
            <div className="vaporwave-subtitle">◈ CONNECT WALLET ◈</div>
          </div>
          <div className="vaporwave-card">
            <div
              className="vaporwave-text"
              style={{ textAlign: "center", fontSize: "1.2rem" }}
            >
              ⟐ WALLET CONNECTION REQUIRED ⟐
              <br />
              <br />
              Connect your wallet to access the lottery
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isFunded) {
    return (
      <div className="vaporwave-container">
        <style>{vaporwaveStyles}</style>
        <div className="vaporwave-content">
          <div className="vaporwave-header">
            <div className="vaporwave-title">NO LOSS LOTTERY</div>
            <div className="vaporwave-subtitle">◈ INSUFFICIENT FUNDS ◈</div>
          </div>
          <div className="vaporwave-card">
            <div
              className="vaporwave-text"
              style={{ textAlign: "center", fontSize: "1.2rem" }}
            >
              ⟐ PLEASE FUND YOUR ACCOUNT ⟐
              <br />
              <br />
              {address.substring(0, 12)}...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !lotteryState) {
    return (
      <div className="vaporwave-container">
        <style>{vaporwaveStyles}</style>
        <div className="vaporwave-content">
          <div className="vaporwave-header">
            <div className="vaporwave-title">NO LOSS LOTTERY</div>
            <div className="vaporwave-subtitle">◈ LOADING ◈</div>
          </div>
          <div className="vaporwave-card">
            <div
              className="vaporwave-text"
              style={{ textAlign: "center", fontSize: "1.2rem" }}
            >
              ⟐ CONNECTING TO BLOCKCHAIN ⟐
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vaporwave-container">
      <style>{vaporwaveStyles}</style>
      <div className="vaporwave-content">
        {/* Header */}
        <div className="vaporwave-header">
          <div className="vaporwave-title">NO LOSS LOTTERY</div>
          <div className="vaporwave-subtitle">◈ VAPORWAVE PROTOCOL V1.0 ◈</div>
        </div>

        {/* Status Card */}
        <div className="vaporwave-card">
          <div className="vaporwave-label">◈ CURRENT STATUS ◈</div>
          <div className={`vaporwave-value ${getStatusClass()}`}>
            {lotteryState.status}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="vaporwave-grid">
          <div className="vaporwave-stat">
            <div className="vaporwave-stat-label">PARTICIPANTS</div>
            <div className="vaporwave-stat-value">
              {lotteryState.no_participants}
            </div>
          </div>
          <div className="vaporwave-stat">
            <div className="vaporwave-stat-label">TOTAL YIELD</div>
            <div className="vaporwave-stat-value">
              {(Number(lotteryState.amount_of_yield) / 10000000).toFixed(4)}
            </div>
          </div>
          <div className="vaporwave-stat">
            <div className="vaporwave-stat-label">TICKET COST</div>
            <div className="vaporwave-stat-value">{ticketAmountXLM} XLM</div>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="vaporwave-card">
            <div className="vaporwave-label">◈ ADMIN CONTROLS ◈</div>
            <div className="vaporwave-grid">
              <button
                type="button"
                className={`vaporwave-button ${lotteryState.status === LotteryStatus.BuyIn ? "vaporwave-button-active" : ""}`}
                onClick={() => void changeStatus(LotteryStatus.BuyIn)}
                disabled={isSubmitting}
              >
                BUY IN
              </button>
              <button
                type="button"
                className={`vaporwave-button ${lotteryState.status === LotteryStatus.YieldFarming ? "vaporwave-button-active" : ""}`}
                onClick={() => void changeStatus(LotteryStatus.YieldFarming)}
                disabled={isSubmitting}
              >
                FARMING
              </button>
              <button
                type="button"
                className={`vaporwave-button ${lotteryState.status === LotteryStatus.Ended ? "vaporwave-button-active" : ""}`}
                onClick={() => void changeStatus(LotteryStatus.Ended)}
                disabled={isSubmitting}
              >
                END
              </button>
            </div>
          </div>
        )}

        {/* Buy Ticket */}
        <div className="vaporwave-card">
          <div className="vaporwave-label">◈ PURCHASE TICKET ◈</div>
          <div className="vaporwave-text">
            ⟐ Submit {ticketAmountXLM} XLM to enter the lottery pool
            <br />
            ⟐ Your funds will be returned regardless of outcome
            <br />⟐ One winner receives all yield
          </div>
          <button
            type="button"
            className="vaporwave-button vaporwave-button-cyan"
            onClick={() => void buyTicket()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "◈ PROCESSING ◈" : "◈ BUY TICKET ◈"}
          </button>
        </div>

        {/* My Tickets */}
        {myTickets.length > 0 && (
          <div className="vaporwave-card">
            <div className="vaporwave-label">
              ◈ YOUR TICKETS ({myTickets.length}) ◈
            </div>
            {myTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={
                  ticket.won
                    ? "vaporwave-ticket vaporwave-ticket-winner"
                    : "vaporwave-ticket"
                }
              >
                <div>
                  <div className="vaporwave-ticket-id">
                    ⟐ TICKET #{ticket.id} {ticket.won && "★ WINNER ★"}
                  </div>
                  <div className="vaporwave-ticket-amount">
                    {(Number(ticket.amount) / 10000000).toFixed(7)} XLM
                  </div>
                </div>
                <button
                  type="button"
                  className="vaporwave-button"
                  onClick={() => void redeemTicket(ticket)}
                  disabled={isSubmitting}
                  style={{
                    width: "auto",
                    padding: "12px 30px",
                    fontSize: "0.9rem",
                  }}
                >
                  REDEEM
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Raffle */}
        {lotteryState.status === LotteryStatus.Ended && isAdmin && (
          <div className="vaporwave-card">
            <div className="vaporwave-label">◈ EXECUTE RAFFLE ◈</div>
            <div className="vaporwave-text">
              ⟐ Lottery phase complete
              <br />⟐ Execute random winner selection protocol
            </div>
            <button
              type="button"
              className="vaporwave-button"
              onClick={() => void runRaffle()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "◈ PROCESSING ◈" : "◈ RUN RAFFLE ◈"}
            </button>
            {winningTicket && (
              <div className="vaporwave-winner-box">
                <div className="vaporwave-label">◈ WINNER SELECTED ◈</div>
                <div className="vaporwave-winner-text">#{winningTicket.id}</div>
                <div className="vaporwave-text" style={{ marginTop: "10px" }}>
                  ⟐ REWARD: DEPOSIT + ALL YIELD ⟐
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="vaporwave-card">
          <div className="vaporwave-label">◈ HOW IT WORKS ◈</div>
          <div className="vaporwave-text">
            ⟐ [1] BUY IN PERIOD — Purchase tickets with XLM
            <br />
            ⟐ [2] YIELD FARMING — Funds generate yield via DeFi
            <br />
            ⟐ [3] LOTTERY ENDS — Random winner selection
            <br />
            ⟐ [4] WINNER — Receives deposit + all yield
            <br />⟐ [5] OTHERS — Full deposit returned (no loss)
          </div>
        </div>
      </div>
    </div>
  );
};
