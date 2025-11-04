import { useState, useEffect, useCallback } from "react";
import {
  SECONDS_PER_LEDGER,
  getMinimumLedgersForStatus,
  ledgersToTimeString,
} from "../util/constants";

interface CountdownData {
  remainingLedgers: number;
  timeString: string;
  canTransition: boolean;
  totalRequired: number;
}

/**
 * Hook to manage status transition countdown
 * Updates locally every 6 seconds, syncs with real data on page load/transactions
 */
export function useStatusCountdown(
  currentStatus: "BuyIn" | "YieldFarming" | "Ended" | null,
  currentLedger: number | null,
  statusStartedLedger: number | null,
): CountdownData {
  const [localCurrentLedger, setLocalCurrentLedger] = useState<number | null>(
    currentLedger,
  );

  // Sync with real ledger data when it changes
  useEffect(() => {
    setLocalCurrentLedger(currentLedger);
  }, [currentLedger]);

  // Tick down every SECONDS_PER_LEDGER
  useEffect(() => {
    if (localCurrentLedger === null) return;

    const interval = setInterval(() => {
      setLocalCurrentLedger((prev) => (prev !== null ? prev + 1 : null));
    }, SECONDS_PER_LEDGER * 1000);

    return () => clearInterval(interval);
  }, [localCurrentLedger]);

  const calculateCountdown = useCallback((): CountdownData => {
    if (
      !currentStatus ||
      localCurrentLedger === null ||
      statusStartedLedger === null
    ) {
      return {
        remainingLedgers: 0,
        timeString: "Calculating...",
        canTransition: false,
        totalRequired: 0,
      };
    }

    const totalRequired = getMinimumLedgersForStatus(currentStatus);
    const elapsed = localCurrentLedger - statusStartedLedger;
    const remaining = Math.max(0, totalRequired - elapsed);
    const canTransition = remaining === 0;

    return {
      remainingLedgers: remaining,
      timeString: remaining > 0 ? ledgersToTimeString(remaining) : "Ready",
      canTransition,
      totalRequired,
    };
  }, [currentStatus, localCurrentLedger, statusStartedLedger]);

  return calculateCountdown();
}
