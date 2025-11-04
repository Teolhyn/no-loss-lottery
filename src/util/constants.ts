/**
 * Ledger and timelock constants matching the smart contract
 * These values must match those in contracts/no-loss-lottery/src/storage.rs
 */

// Average time per ledger in seconds
export const SECONDS_PER_LEDGER = 6;

// Ledger calculations
const DAY_IN_LEDGERS = 17300;

// Minimum time in ledgers required for each status transition
export const MIN_BUYIN_TIME_IN_LEDGERS = DAY_IN_LEDGERS; // 1 day
export const MIN_YIELD_TIME_IN_LEDGERS = DAY_IN_LEDGERS * 6; // 6 days
export const MIN_ENDED_TIME_IN_LEDGERS = DAY_IN_LEDGERS; // 1 day

/**
 * Get the minimum required ledgers for a status transition
 */
export function getMinimumLedgersForStatus(
  status: "BuyIn" | "YieldFarming" | "Ended",
): number {
  switch (status) {
    case "BuyIn":
      return MIN_BUYIN_TIME_IN_LEDGERS;
    case "YieldFarming":
      return MIN_YIELD_TIME_IN_LEDGERS;
    case "Ended":
      return MIN_ENDED_TIME_IN_LEDGERS;
  }
}

/**
 * Convert ledgers to approximate time string
 */
export function ledgersToTimeString(ledgers: number): string {
  const seconds = ledgers * SECONDS_PER_LEDGER;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }
  return `${minutes}m`;
}
