/**
 * Maps Soroban contract error codes to user-friendly messages
 * Error codes are defined in contracts/no-loss-lottery/src/error.rs
 */
export const LOTTERY_ERROR_MESSAGES: Record<number, string> = {
  1: "Operation not allowed in current lottery status",
  2: "Lottery status not found",
  3: "Lottery currency not found",
  4: "Token amount not found",
  5: "Lottery state not found",
  6: "Ticket not found",
  7: "Contract already initialized",
  8: "Not authorized to perform this action",
  9: "Sent to Blend balance not found",
  10: "Blender address not found",
  11: "Admin address not found",
  12: "Blend position not found",
  13: "Ticket IDs not found",
  14: "Winner selection status not found",
  15: "Winner already selected for this round",
  16: "Cannot perform this action while funds are in Blend",
  17: "Random seed not found",
  18: "Farming start ledger not found",
  19: "Buy-in start ledger not found",
  20: "Ended start ledger not found",
  21: "Minimum time lock period has not passed yet",
};

/**
 * Parses a Soroban error message and extracts the error code
 * Example input: "HostError: Error(Contract, #21)"
 * Returns: 21
 */
export function extractErrorCode(errorMessage: string): number | null {
  const match = errorMessage.match(/Error\(Contract,\s*#(\d+)\)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Converts a Soroban error to a user-friendly message
 * @param error - The error object or message from the transaction
 * @returns A user-friendly error message
 */
export function getSorobanErrorMessage(error: unknown): string {
  let errorMessage = "";

  // Handle different error formats
  if (typeof error === "string") {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === "object") {
    // Handle structured error objects
    errorMessage = JSON.stringify(error);
  }

  // Extract error code from the message
  const errorCode = extractErrorCode(errorMessage);

  if (errorCode !== null && LOTTERY_ERROR_MESSAGES[errorCode]) {
    return LOTTERY_ERROR_MESSAGES[errorCode];
  }

  // If we can't find a mapped error, return a generic message
  // but try to extract some useful info
  if (errorMessage.includes("simulation failed")) {
    return "Transaction failed. Please check your wallet balance and try again.";
  }

  if (errorMessage.includes("insufficient")) {
    return "Insufficient balance to complete this transaction";
  }

  if (errorMessage.includes("timeout")) {
    return "Transaction timed out. Please try again.";
  }

  // Return a generic error message if we can't parse it
  return "An unexpected error occurred. Please try again.";
}

/**
 * Formats a detailed error message for debugging purposes
 * This can be used in development or logged for support
 */
export function getDetailedErrorMessage(error: unknown): string {
  const userMessage = getSorobanErrorMessage(error);
  const errorCode = extractErrorCode(String(error));

  if (errorCode !== null) {
    return `${userMessage} (Error code: ${errorCode})`;
  }

  return userMessage;
}
