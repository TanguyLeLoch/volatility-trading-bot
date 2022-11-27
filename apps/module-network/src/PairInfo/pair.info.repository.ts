import { Model } from 'mongoose';
import { PairInfo } from './pair.info';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Pair, Platform } from '@model/common';
import { PairInfoDocument } from './pair.info.document';
import { PairInfoMapper } from './pair.info.mapper';
import winston from 'winston';
import { createCustomLogger } from '@app/core';
import { moduleName } from '../module.info';

@Injectable()
export class PairInfoRepository {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, PairInfoRepository.name);

  constructor(@InjectModel('PairInfo') private readonly pairInfoModel: Model<PairInfoDocument>) {}

  public async findAll(): Promise<PairInfo[]> {
    const pairInfoDocuments = await this.pairInfoModel.find().exec();
    return pairInfoDocuments.map((pairInfoDocument) => PairInfoMapper.toPairInfo(pairInfoDocument));
  }

  public async find(pair: Pair, platform: Platform): Promise<PairInfo | null> {
    const pairInfoDocument = await this.pairInfoModel.findOne({ pair, platform }).exec();
    if (pairInfoDocument !== null) {
      return PairInfoMapper.toPairInfo(pairInfoDocument);
    }
    this.logger.info(`find: pairInfoDocument is null`);
    return null;
  }

  public async save(pairInfo: PairInfo): Promise<PairInfo> {
    const pairInfoDocument: PairInfoDocument = PairInfoMapper.toPairInfoDocument(pairInfo);
    const updatedPairInfoDocumentUpdated = await this.pairInfoModel
      .findOneAndUpdate({ pair: pairInfo.Pair, platform: pairInfo.Platform }, pairInfoDocument, {
        new: true,
        upsert: true,
      })
      .exec();
    return PairInfoMapper.toPairInfo(updatedPairInfoDocumentUpdated);
  }
}
