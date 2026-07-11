export interface TradeDetails {
    symbol: string;
    entryPrice: number;
    exitPrice: number;
    lotSize: number;
    feesAndCommission: number;
    tradePlan: string;
    notes: string;
  }
  
  export interface TradeTestData {
    tradeDetails: TradeDetails;
  }