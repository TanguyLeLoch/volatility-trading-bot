export type RateLimit = {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
};

export type FilterInfo = {
  filterType: string;
  minPrice: string;
  maxPrice: string;
  tickSize: string;
  multiplierUp: string;
  multiplierDown: string;
  avgPriceMins?: number;
  minQty: string;
  maxQty: string;
  stepSize: string;
  minNotional: string;
  applyToMarket?: boolean;
  limit?: number;
  minTrailingAboveDelta?: number;
  maxTrailingAboveDelta?: number;
  minTrailingBelowDelta?: number;
  maxTrailingBelowDelta?: number;
  maxNumOrders?: number;
  maxNumAlgoOrders?: number;
};

export type CexSymbolInfo = {
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
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: FilterInfo[];
  permissions: string[];
};

export type CexSymbolInfoResponse = {
  timezone: string;
  serverTime: number;
  rateLimits: RateLimit[];
  exchangeFilters: any[];
  symbols: CexSymbolInfo[];
};
