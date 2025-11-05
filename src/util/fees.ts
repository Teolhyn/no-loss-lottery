import { horizonUrl } from "../contracts/util";

export interface FeeStats {
  ledger_capacity_usage: string;
  min_accepted_fee: string;
  mode_accepted_fee: string;
  p10_accepted_fee: string;
  p20_accepted_fee: string;
  p30_accepted_fee: string;
  p40_accepted_fee: string;
  p50_accepted_fee: string;
  p60_accepted_fee: string;
  p70_accepted_fee: string;
  p80_accepted_fee: string;
  p90_accepted_fee: string;
  p95_accepted_fee: string;
  p99_accepted_fee: string;
}

/**
 * Fetches current network fee statistics from Horizon
 */
export async function fetchFeeStats(): Promise<FeeStats> {
  const response = await fetch(`${horizonUrl}/fee_stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch fee stats: ${response.statusText}`);
  }
  const data = (await response.json()) as FeeStats;
  return data;
}

/**
 * Calculates a recommended fee based on network conditions
 * @param targetPercentile - Which percentile to target (higher = more likely to be included quickly)
 * @returns Recommended fee in stroops
 */
export async function getRecommendedFee(
  targetPercentile: number = 80,
): Promise<number> {
  const BASE_FEE = 100; // Stellar's minimum base fee
  const MAX_FEE = 1000000; // Safety cap at 0.1 XLM

  try {
    const stats = await fetchFeeStats();

    // Choose fee based on percentile
    let recommendedFee: number;
    if (targetPercentile >= 99) {
      recommendedFee = parseInt(stats.p99_accepted_fee);
    } else if (targetPercentile >= 95) {
      recommendedFee = parseInt(stats.p95_accepted_fee);
    } else if (targetPercentile >= 90) {
      recommendedFee = parseInt(stats.p90_accepted_fee);
    } else if (targetPercentile >= 80) {
      recommendedFee = parseInt(stats.p80_accepted_fee);
    } else if (targetPercentile >= 70) {
      recommendedFee = parseInt(stats.p70_accepted_fee);
    } else if (targetPercentile >= 50) {
      recommendedFee = parseInt(stats.p50_accepted_fee);
    } else {
      recommendedFee = parseInt(stats.mode_accepted_fee);
    }

    // Apply safety bounds
    return Math.min(Math.max(recommendedFee, BASE_FEE), MAX_FEE);
  } catch (error) {
    console.error("Failed to fetch fee stats, using default:", error);
    // Fallback to a reasonable default (10x base fee)
    return 1000;
  }
}

/**
 * Estimates the total fee for a Soroban transaction
 * Soroban transactions typically need more than the base fee
 * @param includeResourceFees - Whether to include estimated resource fees
 * @returns Estimated total fee in stroops
 */
export async function getSorobanRecommendedFee(): Promise<string> {
  // For Soroban, we need to account for:
  // 1. Base transaction fee
  // 2. Resource fees (CPU, memory, ledger access)

  const baseFee = await getRecommendedFee(80); // Target 80th percentile

  // Soroban transactions typically need 10-50x the base fee depending on complexity
  // We'll use simulation results, but provide a reasonable minimum
  const sorobanMinimum = baseFee * 10;

  return sorobanMinimum.toString();
}
