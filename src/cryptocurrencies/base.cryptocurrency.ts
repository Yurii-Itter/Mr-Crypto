import * as ws from 'ws';
import axios, { AxiosResponse } from 'axios';

import { Injectable, Logger } from '@nestjs/common';

import { UtilService } from '../common/util.service';

import { ListInterface } from './interfaces/list.interface';

@Injectable()
export class BaseCryptocurrency {
  protected utilService: UtilService;
  protected logger: Logger;

  protected stream: any;

  public list: ListInterface = {};

  constructor(utilService: UtilService, logger: Logger) {
    this.utilService = utilService;
    this.logger = logger;
  }

  protected async getExchangeInfo(link: string): Promise<AxiosResponse> {
    try {
      return axios.get(link);
    } catch (error) {
      this.logger.error(error);
    }
  }

  protected async getAllMarketTickersStream(link: string): Promise<any> {
    try {
      return new ws(link);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async symbols(): Promise<string[]> {
    throw new Error('not implemented');
  }

  public async streamHandler(symbols: string[]): Promise<void> {
    throw new Error('not implemented');
  }
}
