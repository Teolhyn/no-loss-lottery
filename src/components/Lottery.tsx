import { useState, useEffect, useMemo, useCallback } from "react";
import { useWallet } from "../hooks/useWallet";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { useNotification } from "../hooks/useNotification";
import lotteryContract from "../contracts/no_loss_lottery";
import * as NoLossLottery from "no_loss_lottery";
import { rpcUrl, stellarNetwork } from "../contracts/util";
import { Address } from "@stellar/stellar-sdk";
import { WalletButton } from "./WalletButton";
import NetworkPill from "./NetworkPill";
import FundAccountButton from "./FundAccountButton";
import { useNavigate } from "react-router-dom";

// 80s Amber Terminal Theme CSS
const amberStyles = `
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  .amber-container {
    background: rgba(255, 170, 0, 0.03);
    color: #FFAA00;
    font-family: 'Courier New', monospace;
    min-height: 100vh;
    padding: 0;
    margin: 0;
    position: relative;
  }

  .amber-container::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15) 0px,
      rgba(0, 0, 0, 0.15) 2px,
      transparent 2px,
      transparent 4px
    );
    pointer-events: none;
    z-index: 999;
  }

  .amber-container::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
    pointer-events: none;
    z-index: 998;
  }

  .amber-content {
    position: relative;
    z-index: 10;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px 20px 20px;
  }

  .amber-header {
    text-align: center;
    padding: 20px;
    border-bottom: 2px solid #FFAA00;
    margin-bottom: 20px;
    position: relative;
  }

  .amber-wallet-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding: 20px;
    margin: 0 0 20px 0;
    border: 2px solid #FFAA00;
    background: rgba(255, 170, 0, 0.03);
    box-shadow: 0 0 20px rgba(255, 170, 0, 0.1);
    position: relative;
  }

  .amber-wallet-bar::before {
    content: "┌";
    position: absolute;
    top: -2px;
    left: -2px;
    font-size: 1.5rem;
  }

  .amber-wallet-bar::after {
    content: "┘";
    position: absolute;
    bottom: -2px;
    right: -2px;
    font-size: 1.5rem;
  }

  .amber-debug-button {
    background: transparent;
    color: #FFAA00;
    border: 2px solid #FFAA00;
    font-family: 'Courier New', monospace;
    fontSize: 0.9rem;
    font-weight: bold;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.2s;
    text-shadow: 0 0 5px #FFAA00;
    box-shadow: 0 0 15px rgba(255, 170, 0, 0.2);
    text-decoration: none;
    display: inline-block;
  }

  .amber-debug-button:hover {
    background: rgba(255, 170, 0, 0.1);
    box-shadow: 0 0 30px rgba(255, 170, 0, 0.4);
    text-shadow: 0 0 10px #FFAA00, 0 0 20px #FFAA00;
  }

  .amber-header::before {
    content: "┌─────────────────────────────────────────────────┐";
    display: block;
    margin-bottom: 15px;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  .amber-header::after {
    content: "└─────────────────────────────────────────────────┘";
    display: block;
    margin-top: 10px;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  .amber-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 15px 0;
    text-shadow: 0 0 10px #FFAA00, 0 0 20px #FFAA00;
    letter-spacing: 8px;
  }

  .amber-subtitle {
    font-size: 1rem;
    margin-top: 10px;
    letter-spacing: 4px;
  }

  .amber-section {
    border: 2px solid #FFAA00;
    padding: 25px;
    margin-bottom: 20px;
    background: rgba(255, 170, 0, 0.03);
    box-shadow: 0 0 20px rgba(255, 170, 0, 0.1);
    position: relative;
  }

  .amber-section::before {
    content: "┌";
    position: absolute;
    top: -2px;
    left: -2px;
    font-size: 1.5rem;
  }

  .amber-section::after {
    content: "┘";
    position: absolute;
    bottom: -2px;
    right: -2px;
    font-size: 1.5rem;
  }

  .amber-label {
    font-size: 0.9rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 10px;
    display: block;
    text-shadow: 0 0 8px #FFAA00;
  }

  .amber-label::before {
    content: "> ";
  }

  .amber-value {
    font-size: 3rem;
    font-weight: bold;
    margin: 15px 0;
    text-shadow: 0 0 15px #FFAA00, 0 0 25px #FFAA00;
    letter-spacing: 2px;
  }

  .amber-status-buyin {
    color: #FFAA00;
  }

  .amber-status-farming {
    color: #FFD700;
  }

  .amber-status-ended {
    color: #FF8800;
  }

  .amber-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin: 20px 0;
  }

  .amber-stat {
    border: 2px solid #FFAA00;
    padding: 20px;
    text-align: center;
    background: rgba(255, 170, 0, 0.05);
  }

  .amber-stat-label {
    font-size: 0.8rem;
    letter-spacing: 2px;
    margin-bottom: 10px;
    text-transform: uppercase;
    opacity: 0.8;
  }

  .amber-stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    text-shadow: 0 0 10px #FFAA00;
  }

  .amber-button {
    background: transparent;
    color: #FFAA00;
    border: 2px solid #FFAA00;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    font-weight: bold;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 15px 30px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    margin: 10px 0;
    text-shadow: 0 0 5px #FFAA00;
    box-shadow: 0 0 15px rgba(255, 170, 0, 0.2);
  }

  .amber-button::before {
    content: "[";
    margin-right: 10px;
  }

  .amber-button::after {
    content: "]";
    margin-left: 10px;
  }

  .amber-button:hover:not(:disabled) {
    background: rgba(255, 170, 0, 0.1);
    box-shadow: 0 0 30px rgba(255, 170, 0, 0.4);
    text-shadow: 0 0 10px #FFAA00, 0 0 20px #FFAA00;
  }

  .amber-button:active:not(:disabled) {
    transform: scale(0.98);
  }

  .amber-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .amber-button-active {
    background: rgba(255, 170, 0, 0.15);
    box-shadow: 0 0 25px rgba(255, 170, 0, 0.5), inset 0 0 20px rgba(255, 170, 0, 0.2);
  }

  .amber-ticket {
    border: 2px solid #FFAA00;
    padding: 15px;
    margin-bottom: 15px;
    background: rgba(255, 170, 0, 0.03);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .amber-ticket::before {
    content: "│";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2rem;
    opacity: 0.5;
  }

  .amber-ticket-winner {
    background: rgba(255, 170, 0, 0.15);
    border-color: #FFD700;
    box-shadow: 0 0 30px rgba(255, 170, 0, 0.5);
  }

  .amber-ticket-winner::before {
    content: "★";
    color: #FFD700;
  }

  .amber-ticket-id {
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 0 0 5px #FFAA00;
  }

  .amber-ticket-amount {
    font-size: 0.9rem;
    margin-top: 5px;
    opacity: 0.8;
  }

  .amber-text {
    font-size: 1rem;
    line-height: 1.8;
    margin: 15px 0;
    letter-spacing: 1px;
  }

  .amber-text strong {
    font-weight: bold;
    text-shadow: 0 0 5px #FFAA00;
  }

  .amber-winner-box {
    border: 3px solid #FFD700;
    padding: 30px;
    margin-top: 20px;
    text-align: center;
    background: rgba(255, 215, 0, 0.1);
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.5);
    position: relative;
  }

  .amber-winner-box::before {
    content: "★ WINNER ★";
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: #0A0500;
    padding: 0 15px;
    font-size: 0.9rem;
    text-shadow: 0 0 10px #FFD700;
  }

  .amber-winner-number {
    font-size: 4rem;
    font-weight: bold;
    color: #FFD700;
    margin: 20px 0;
    text-shadow: 0 0 20px #FFD700, 0 0 40px #FFD700;
  }

  .amber-cursor {
    animation: blink 1s infinite;
  }

  .amber-prompt {
    opacity: 0.6;
    margin-right: 10px;
  }

  @media (max-width: 768px) {
    .amber-title {
      font-size: 1.8rem;
    }

    .amber-grid {
      grid-template-columns: 1fr;
    }

    .amber-winner-number {
      font-size: 2.5rem;
    }

    .amber-header::before,
    .amber-header::after {
      font-size: 0.5rem;
    }

    .amber-wallet-bar {
      flex-direction: column;
      gap: 10px;
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
  const [ticketAmount, setTicketAmount] = useState<bigint>(BigInt(10000000)); // Default 1 XLM

  const { address, signTransaction } = useWallet();
  const { isFunded } = useWalletBalance();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

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

        // Fetch ticket amount from contract
        const ticketAmountResult = await lotteryContract.get_ticket_amount();
        if (ticketAmountResult.result.isOk()) {
          const amount = ticketAmountResult.result.unwrap();
          setTicketAmount(BigInt(amount.toString()));
        }

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

  const blendIt = async () => {
    if (!address || !adminAddress) {
      addNotification("Admin address not found", "error");
      return;
    }

    if (String(address).toLowerCase() !== String(adminAddress).toLowerCase()) {
      addNotification("Only admin can call blend_it", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await lottery.blend_it();
      const response = await tx.signAndSend();

      if (response.result.isErr()) {
        const error = response.result.unwrapErr();
        addNotification(`Error: ${JSON.stringify(error)}`, "error");
      } else {
        addNotification("Funds sent to Blend successfully!", "success");
        // Reload lottery data
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
      }
    } catch (error) {
      addNotification("Failed to send funds to Blend", "error");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const withdrawFromBlend = async () => {
    if (!address || !adminAddress) {
      addNotification("Admin address not found", "error");
      return;
    }

    if (String(address).toLowerCase() !== String(adminAddress).toLowerCase()) {
      addNotification("Only admin can withdraw from Blend", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await lottery.withdraw_from_blend();
      const response = await tx.signAndSend();

      if (response.result.isErr()) {
        const error = response.result.unwrapErr();
        addNotification(`Error: ${JSON.stringify(error)}`, "error");
      } else {
        const yieldAmount = response.result.unwrap();
        addNotification(
          `Withdrew from Blend! Yield: ${Number(yieldAmount) / 10000000} XLM`,
          "success",
        );
        // Reload lottery data
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
      }
    } catch (error) {
      addNotification("Failed to withdraw from Blend", "error");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClass = () => {
    switch (lotteryState?.status) {
      case LotteryStatus.BuyIn:
        return "amber-status-buyin";
      case LotteryStatus.YieldFarming:
        return "amber-status-farming";
      case LotteryStatus.Ended:
        return "amber-status-ended";
      default:
        return "";
    }
  };

  const ticketAmountXLM = Number(ticketAmount) / 10000000;
  const isAdmin =
    address &&
    adminAddress &&
    address.toLowerCase() === adminAddress.toLowerCase();

  if (!address) {
    return (
      <div className="amber-container">
        <style>{amberStyles}</style>
        <div className="amber-header">
          <div className="amber-title">NO LOSS LOTTERY</div>
          <div className="amber-subtitle">SYSTEM v1.0</div>
        </div>
        <div className="amber-content">
          <div className="amber-wallet-bar">
            <WalletButton />
            <NetworkPill />
            <button
              type="button"
              className="amber-debug-button"
              onClick={() => void navigate("/debug")}
            >
              &gt; Debug
            </button>
          </div>
          <div className="amber-section">
            <div className="amber-label">SYSTEM STATUS</div>
            <div className="amber-text">
              <span className="amber-prompt">&gt;</span>
              WALLET CONNECTION REQUIRED
              <br />
              <br />
              Connect your wallet to participate in the lottery
              <span className="amber-cursor">_</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isFunded) {
    return (
      <div className="amber-container">
        <style>{amberStyles}</style>
        <div className="amber-header">
          <div className="amber-title">NO LOSS LOTTERY</div>
          <div className="amber-subtitle">SYSTEM v1.0</div>
        </div>
        <div className="amber-content">
          <div className="amber-wallet-bar">
            <WalletButton />
            {stellarNetwork !== "PUBLIC" && <FundAccountButton />}
            <NetworkPill />
            <button
              type="button"
              className="amber-debug-button"
              onClick={() => void navigate("/debug")}
            >
              &gt; Debug
            </button>
          </div>
          <div className="amber-section">
            <div className="amber-label">INSUFFICIENT FUNDS</div>
            <div className="amber-text">
              <span className="amber-prompt">&gt;</span>
              PLEASE FUND YOUR ACCOUNT
              <br />
              <br />
              Wallet: {address.substring(0, 12)}...
              <span className="amber-cursor">_</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !lotteryState) {
    return (
      <div className="amber-container">
        <style>{amberStyles}</style>
        <div className="amber-header">
          <div className="amber-title">NO LOSS LOTTERY</div>
          <div className="amber-subtitle">SYSTEM v1.0</div>
        </div>
        <div className="amber-content">
          <div className="amber-wallet-bar">
            <WalletButton />
            {stellarNetwork !== "PUBLIC" && <FundAccountButton />}
            <NetworkPill />
            <button
              type="button"
              className="amber-debug-button"
              onClick={() => void navigate("/debug")}
            >
              &gt; Debug
            </button>
          </div>
          <div className="amber-section">
            <div className="amber-label">INITIALIZING</div>
            <div className="amber-text">
              <span className="amber-prompt">&gt;</span>
              CONNECTING TO BLOCKCHAIN
              <span className="amber-cursor">_</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="amber-container">
      <style>{amberStyles}</style>

      {/* Header */}
      <div className="amber-header">
        <div className="amber-title">NO LOSS LOTTERY</div>
        <div className="amber-subtitle">SYSTEM v1.0</div>
      </div>

      <div className="amber-content">
        {/* Wallet Bar */}
        <div className="amber-wallet-bar">
          <WalletButton />
          {stellarNetwork !== "PUBLIC" && <FundAccountButton />}
          <NetworkPill />
          <button
            type="button"
            className="amber-debug-button"
            onClick={() => void navigate("/debug")}
          >
            &gt; Debug
          </button>
        </div>

        {/* Status Section */}
        <div className="amber-section">
          <div className="amber-label">CURRENT STATUS</div>
          <div className={`amber-value ${getStatusClass()}`}>
            {lotteryState.status}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="amber-grid">
          <div className="amber-stat">
            <div className="amber-stat-label">PARTICIPANTS</div>
            <div className="amber-stat-value">
              {lotteryState.no_participants}
            </div>
          </div>
          <div className="amber-stat">
            <div className="amber-stat-label">TOTAL YIELD</div>
            <div className="amber-stat-value">
              {(Number(lotteryState.amount_of_yield) / 10000000).toFixed(2)}
            </div>
          </div>
          <div className="amber-stat">
            <div className="amber-stat-label">TICKET COST</div>
            <div className="amber-stat-value">${ticketAmountXLM}</div>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="amber-section">
            <div className="amber-label">ADMIN CONTROLS - STATUS</div>
            <div className="amber-grid">
              <button
                type="button"
                className={`amber-button ${lotteryState.status === LotteryStatus.BuyIn ? "amber-button-active" : ""}`}
                onClick={() => void changeStatus(LotteryStatus.BuyIn)}
                disabled={isSubmitting}
              >
                Buy In
              </button>
              <button
                type="button"
                className={`amber-button ${lotteryState.status === LotteryStatus.YieldFarming ? "amber-button-active" : ""}`}
                onClick={() => void changeStatus(LotteryStatus.YieldFarming)}
                disabled={isSubmitting}
              >
                Farming
              </button>
              <button
                type="button"
                className={`amber-button ${lotteryState.status === LotteryStatus.Ended ? "amber-button-active" : ""}`}
                onClick={() => void changeStatus(LotteryStatus.Ended)}
                disabled={isSubmitting}
              >
                End
              </button>
            </div>

            <div className="amber-label" style={{ marginTop: "20px" }}>
              ADMIN CONTROLS - BLEND
            </div>
            <div className="amber-grid">
              <button
                type="button"
                className="amber-button"
                onClick={() => void blendIt()}
                disabled={
                  isSubmitting ||
                  lotteryState.status !== LotteryStatus.YieldFarming
                }
                title="Send funds to Blend pool for yield farming"
              >
                Send to Blend
              </button>
              <button
                type="button"
                className="amber-button"
                onClick={() => void withdrawFromBlend()}
                disabled={
                  isSubmitting || lotteryState.status !== LotteryStatus.Ended
                }
                title="Withdraw funds from Blend pool"
              >
                Withdraw from Blend
              </button>
            </div>
          </div>
        )}

        {/* Buy Ticket */}
        <div className="amber-section">
          <div className="amber-label">PURCHASE TICKET</div>
          <div className="amber-text">
            <span className="amber-prompt">&gt;</span>
            <strong>
              Submit {ticketAmountXLM} USDC to enter the lottery pool.
            </strong>
            <br />
            <span className="amber-prompt">&gt;</span>
            Your funds will be returned regardless of outcome.
            <br />
            <span className="amber-prompt">&gt;</span>
            One winner receives all accumulated yield.
          </div>
          <button
            type="button"
            className="amber-button"
            onClick={() => void buyTicket()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing" : "Buy Ticket"}
          </button>
        </div>

        {/* My Tickets */}
        {myTickets.length > 0 && (
          <div className="amber-section">
            <div className="amber-label">YOUR TICKETS ({myTickets.length})</div>
            {myTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={
                  ticket.won
                    ? "amber-ticket amber-ticket-winner"
                    : "amber-ticket"
                }
              >
                <div>
                  <div className="amber-ticket-id">
                    TICKET #{ticket.id} {ticket.won && "★ WINNER"}
                  </div>
                  <div className="amber-ticket-amount">
                    ${(Number(ticket.amount) / 10000000).toFixed(2)} USDC
                  </div>
                </div>
                <button
                  type="button"
                  className="amber-button"
                  onClick={() => void redeemTicket(ticket)}
                  disabled={isSubmitting}
                  style={{
                    width: "auto",
                    padding: "15px 30px",
                    fontSize: "0.9rem",
                  }}
                >
                  Redeem
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Raffle */}
        {lotteryState.status === LotteryStatus.Ended && isAdmin && (
          <div className="amber-section">
            <div className="amber-label">EXECUTE WINNER SELECTION</div>
            <div className="amber-text">
              <span className="amber-prompt">&gt;</span>
              The lottery phase has concluded.
              <br />
              <span className="amber-prompt">&gt;</span>
              Execute the random winner selection protocol.
            </div>
            <button
              type="button"
              className="amber-button"
              onClick={() => void runRaffle()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing" : "Run Raffle"}
            </button>
            {winningTicket && (
              <div className="amber-winner-box">
                <div className="amber-winner-number">#{winningTicket.id}</div>
                <div className="amber-text">REWARD: DEPOSIT + ALL YIELD</div>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="amber-section">
          <div className="amber-label">HOW THE SYSTEM WORKS</div>
          <div className="amber-text">
            <span className="amber-prompt">&gt;</span>
            <strong>1. BUY IN PERIOD</strong> — Purchase tickets with XLM
            <br />
            <span className="amber-prompt">&gt;</span>
            <strong>2. YIELD FARMING</strong> — Funds generate yield via DeFi
            protocols
            <br />
            <span className="amber-prompt">&gt;</span>
            <strong>3. LOTTERY ENDS</strong> — Random winner selection executed
            <br />
            <span className="amber-prompt">&gt;</span>
            <strong>4. WINNER</strong> — Receives deposit + all generated yield
            <br />
            <span className="amber-prompt">&gt;</span>
            <strong>5. PARTICIPANTS</strong> — All others receive full deposit
            back
          </div>
        </div>
      </div>
    </div>
  );
};
