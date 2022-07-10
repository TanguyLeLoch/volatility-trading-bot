export type SymbolInfo = {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: string[];
  quoteOrderQtyMarketAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  quoteAmountPrecision: string;
  baseSizePrecision: string;
  permissions: string[];
  filters: any[];
  maxQuoteAmount: string;
  makerCommission: string;
  takerCommission: string;
};

export type SymbolInfoResponse = {
  timezone: string;
  serverTime: number;
  rateLimits: any[];
  exchangeFilters: any[];
  symbols: SymbolInfo[];
};
