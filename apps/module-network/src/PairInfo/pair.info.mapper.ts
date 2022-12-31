import { PairInfoDocument } from './pair.info.document';
import { PairInfo } from './pair.info';
import { CexSymbolInfoResponse, FilterInfo } from '@model/network';
import { Pair, Platform } from '@model/common';

export class PairInfoMapper {
  public static toPairInfo(pairInfoDocument: PairInfoDocument): PairInfo {
    return new PairInfo(
      pairInfoDocument.pair,
      pairInfoDocument.orderTypes,
      pairInfoDocument.stepSize,
      pairInfoDocument.platform,
      pairInfoDocument.updatedAt,
    );
  }

  public static toPairInfoDocument(pairInfo: PairInfo): PairInfoDocument {
    return new PairInfoDocument(pairInfo.Pair, pairInfo.OrderTypes, pairInfo.StepSize, pairInfo.Platform);
  }

  public static toPairInfoFromCex(cexSymbolInfoResponse: CexSymbolInfoResponse, platform: Platform): PairInfo {
    const symbol = cexSymbolInfoResponse.symbols[0];
    const pair: Pair = { token1: symbol.baseAsset, token2: symbol.quoteAsset };
    const orderTypes = symbol.orderTypes;
    const lot_size: FilterInfo | undefined = symbol.filters.find((filter) => filter.filterType === 'LOT_SIZE');
    let stepSize;
    if (lot_size !== undefined) {
      stepSize = parseFloat(lot_size.stepSize);
    } else {
      stepSize = Math.pow(10, -symbol.quoteAssetPrecision).toPrecision(symbol.quoteAssetPrecision);
    }
    return new PairInfo(pair, orderTypes, stepSize, platform, new Date());
  }
}
