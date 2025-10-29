import { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Text, Card } from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { useNotification } from "../hooks/useNotification";
import { Box } from "./layout/Box";
import lotteryContract from "../contracts/no_loss_lottery";
import * as NoLossLottery from "no_loss_lottery";
import { rpcUrl } from "../contracts/util";
import { Address } from "@stellar/stellar-sdk";

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
  const [adminAddress, setAdminAddress] = useState<string | null>(null); // Store as string

  const { address, signTransaction } = useWallet();
  const { isFunded } = useWalletBalance();
  const { addNotification } = useNotification();

  // Create a lottery client with the user's wallet
  const lottery = useMemo(() => {
    if (!address || !signTransaction) {
      return lotteryContract; // Use default client for read-only operations
    }

    // Create a new client instance with the user's public key and sign function
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

        // Get lottery state - use lotteryContract (default client) for read-only
        const stateResult = await lotteryContract.get_lottery_state();
        if (stateResult.result.isOk()) {
          const state = stateResult.result.unwrap();
          // Extract status tag from enum object
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

        // Get admin address - use lotteryContract (default client) for read-only
        // get_admin returns Option<Address> directly (no Result wrapper)
        const adminTx = await lotteryContract.get_admin();
        // Extract from simulation result
        const simulation = adminTx.simulation as
          | { result?: { retval?: unknown } }
          | undefined;
        const adminScVal = simulation?.result?.retval;
        console.log("Admin ScVal from contract:", adminScVal);

        // Convert XDR address to string
        let adminAddressStr = null;
        if (
          adminScVal &&
          typeof adminScVal === "object" &&
          "_arm" in adminScVal &&
          adminScVal._arm === "address" &&
          "_value" in adminScVal
        ) {
          try {
            // The ScVal contains an ScAddress inside _value
            const scAddress = adminScVal._value as Parameters<
              typeof Address.fromScAddress
            >[0];
            const adminAddr = Address.fromScAddress(scAddress);
            adminAddressStr = adminAddr.toString();
            console.log("Admin address string:", adminAddressStr);
          } catch (e) {
            console.error("Failed to convert admin address:", e);
          }
        }
        setAdminAddress(adminAddressStr);

        // Load user tickets
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

  if (!address) {
    return (
      <Card>
        <Text as="p" size="md">
          Connect your wallet to participate in the No-Loss Lottery
        </Text>
      </Card>
    );
  }

  if (!isFunded) {
    return (
      <Card>
        <Text as="p" size="md">
          Fund your account first to participate in the lottery
        </Text>
      </Card>
    );
  }

  if (isLoading || !lotteryState) {
    return (
      <Card>
        <Text as="p" size="md">
          Loading lottery data...
        </Text>
      </Card>
    );
  }

  const buyTicket = async () => {
    if (!address) return;

    setIsSubmitting(true);
    try {
      console.log("Building transaction...");

      // Build the transaction
      const tx = await lottery.buy_ticket({ user: address });

      console.log("Signing and sending transaction...");

      // Sign and send the transaction - this will prompt wallet
      const response = await tx.signAndSend();

      console.log("Transaction sent!", response);

      if (response.result.isErr()) {
        const error = response.result.unwrapErr();
        addNotification(`Error: ${JSON.stringify(error)}`, "error");
      } else {
        addNotification("Ticket purchased successfully!", "success");
        // Reload tickets from contract
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
        // Reload tickets from contract
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

        // Reload tickets from contract to reflect updated won status
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
      // Convert status string to enum format expected by contract
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

  const getStatusColor = () => {
    switch (lotteryState.status) {
      case LotteryStatus.BuyIn:
        return "#00c853";
      case LotteryStatus.YieldFarming:
        return "#ffa726";
      case LotteryStatus.Ended:
        return "#ef5350";
      default:
        return "#757575";
    }
  };

  const ticketAmountXLM = 1; // 10000000 stroops = 1 XLM
  const isAdmin =
    address &&
    adminAddress &&
    address.toLowerCase() === adminAddress.toLowerCase();

  // Debug admin check
  console.log("Admin check:", {
    address,
    adminAddress,
    isAdmin,
  });

  return (
    <Box gap="lg" style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Status Card */}
      <Card>
        <Box gap="md">
          <Text as="h2" size="lg">
            No-Loss Lottery
          </Text>
          <Box gap="sm" direction="row" align="center">
            <Text as="p" size="md">
              Status:
            </Text>
            <Text
              as="p"
              size="md"
              style={{
                color: getStatusColor(),
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              {lotteryState.status}
            </Text>
          </Box>
          <Text as="p" size="md" style={{ fontSize: "0.9rem", color: "#666" }}>
            {lotteryState.status === LotteryStatus.BuyIn &&
              "Buy tickets now! Your funds will be used for yield farming."}
            {lotteryState.status === LotteryStatus.YieldFarming &&
              "Yield farming in progress. Tickets cannot be redeemed yet."}
            {lotteryState.status === LotteryStatus.Ended &&
              "Lottery ended! Raffle can be run and tickets redeemed."}
          </Text>
          <Box gap="xs">
            <Text as="p" size="sm" style={{ color: "#666" }}>
              Participants: {lotteryState.no_participants}
            </Text>
            <Text as="p" size="sm" style={{ color: "#666" }}>
              Total Yield:{" "}
              {(Number(lotteryState.amount_of_yield) / 10000000).toFixed(7)} XLM
            </Text>
          </Box>
        </Box>
      </Card>

      {/* Admin Controls Card - Separate and prominent */}
      {isAdmin && (
        <Card
          style={{ backgroundColor: "#f0f9ff", border: "2px solid #0ea5e9" }}
        >
          <Box gap="md">
            <Box gap="xs">
              <Text as="h3" size="md" style={{ color: "#0369a1" }}>
                🔑 Admin Controls
              </Text>
              <Text as="p" size="sm" style={{ color: "#666" }}>
                You are logged in as the admin. You can change the lottery
                status here.
              </Text>
            </Box>

            <Box gap="sm">
              <Text as="p" size="sm" style={{ fontWeight: "bold" }}>
                Change Lottery Status:
              </Text>
              <Box gap="sm" direction="row" wrap="wrap">
                <Button
                  size="md"
                  variant={
                    lotteryState.status === LotteryStatus.BuyIn
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => void changeStatus(LotteryStatus.BuyIn)}
                  disabled={isSubmitting}
                >
                  Set Buy-In Phase
                </Button>
                <Button
                  size="md"
                  variant={
                    lotteryState.status === LotteryStatus.YieldFarming
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => void changeStatus(LotteryStatus.YieldFarming)}
                  disabled={isSubmitting}
                >
                  Set Yield Farming Phase
                </Button>
                <Button
                  size="md"
                  variant={
                    lotteryState.status === LotteryStatus.Ended
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => void changeStatus(LotteryStatus.Ended)}
                  disabled={isSubmitting}
                >
                  End Lottery
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      )}

      {/* Buy Ticket Card */}
      <Card>
        <Box gap="md">
          <Text as="h3" size="md">
            Buy Ticket
          </Text>
          <Text as="p" size="md" style={{ fontSize: "0.9rem", color: "#666" }}>
            Purchase a lottery ticket. Your funds will be used for yield farming
            and returned to you regardless of winning.
          </Text>
          <Box gap="sm" direction="row" align="end">
            <Text as="p" size="md" style={{ fontWeight: "bold" }}>
              Ticket Cost: {ticketAmountXLM} XLM
            </Text>
            <Button
              variant="primary"
              onClick={() => void buyTicket()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Buying..." : "Buy Ticket"}
            </Button>
          </Box>
        </Box>
      </Card>

      {/* My Tickets Card */}
      {myTickets.length > 0 && (
        <Card>
          <Box gap="md">
            <Text as="h3" size="md">
              My Tickets ({myTickets.length})
            </Text>
            <Box gap="sm">
              {myTickets.map((ticket) => (
                <Box
                  key={ticket.id}
                  gap="sm"
                  direction="row"
                  align="center"
                  justify="space-between"
                  style={{
                    padding: "12px",
                    border: ticket.won ? "2px solid #00c853" : "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: ticket.won ? "#e8f5e9" : "#fafafa",
                  }}
                >
                  <Box gap="xs">
                    <Text as="p" size="md" style={{ fontWeight: "bold" }}>
                      Ticket #{ticket.id}
                      {ticket.won && " 🏆 WINNER"}
                    </Text>
                    <Text
                      as="p"
                      size="sm"
                      style={{ fontSize: "0.85rem", color: "#666" }}
                    >
                      Amount: {(Number(ticket.amount) / 10000000).toFixed(7)}{" "}
                      XLM
                    </Text>
                  </Box>
                  <Button
                    size="sm"
                    variant={ticket.won ? "primary" : "secondary"}
                    onClick={() => void redeemTicket(ticket)}
                    disabled={isSubmitting}
                  >
                    Redeem
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      )}

      {/* Raffle Card */}
      {lotteryState.status === LotteryStatus.Ended && isAdmin && (
        <Card>
          <Box gap="md">
            <Text as="h3" size="md">
              Run Raffle
            </Text>
            <Text
              as="p"
              size="md"
              style={{ fontSize: "0.9rem", color: "#666" }}
            >
              The lottery has ended. Run the raffle to select a winner.
            </Text>
            <Button
              variant="primary"
              onClick={() => void runRaffle()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Running..." : "Run Raffle"}
            </Button>
            {winningTicket && (
              <Box
                style={{
                  padding: "16px",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "8px",
                  border: "2px solid #00c853",
                }}
              >
                <Text
                  as="p"
                  size="md"
                  style={{ fontWeight: "bold", color: "#00c853" }}
                >
                  Winning Ticket: #{winningTicket.id}
                </Text>
                <Text as="p" size="md" style={{ fontSize: "0.9rem" }}>
                  Winner gets their deposit back + all the yield!
                </Text>
              </Box>
            )}
          </Box>
        </Card>
      )}

      {/* Info Card */}
      <Card>
        <Box gap="sm">
          <Text as="h3" size="md">
            How It Works
          </Text>
          <Box gap="xs">
            <Text as="p" size="md" style={{ fontSize: "0.9rem" }}>
              1. <strong>Buy-In Period:</strong> Purchase lottery tickets with
              XLM
            </Text>
            <Text as="p" size="md" style={{ fontSize: "0.9rem" }}>
              2. <strong>Yield Farming:</strong> Your XLM is used to generate
              yield
            </Text>
            <Text as="p" size="md" style={{ fontSize: "0.9rem" }}>
              3. <strong>Lottery Ends:</strong> A raffle selects the winner
            </Text>
            <Text as="p" size="md" style={{ fontSize: "0.9rem" }}>
              4. <strong>Winner:</strong> Gets their deposit + all generated
              yield
            </Text>
            <Text as="p" size="md" style={{ fontSize: "0.9rem" }}>
              5. <strong>Losers:</strong> Get their full deposit back (no loss!)
            </Text>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
