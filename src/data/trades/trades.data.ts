import { getEnvVariable } from "@utilities/env.utils";
import { TradeTestData } from "@interfaces/trade/trades.interface";

/**
 * Resolves the configuration base URL mapped inside environmental properties
 * @returns {string} 
 */
export const getApplicationUrl = (): string => getEnvVariable("URL");

/**
 * Provides static test data object parameters mapped cleanly via trade interface properties
 * @returns {TradeTestData} 
 */
export const getTradeTestData = (): TradeTestData => {
  return {
    tradeDetails: {
      symbol: "BTC/USDT",
      entryPrice: 65000.00,
      exitPrice: 68000.00,
      lotSize: 0.05,
      feesAndCommission: 15.50,
      tradePlan: "Breakout Strategy Execution Plan",
      notes: "Automated regression validation test run tracking asset parameters.",
    },
  };
};