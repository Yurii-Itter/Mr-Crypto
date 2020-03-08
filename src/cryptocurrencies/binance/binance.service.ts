import { Injectable } from '@nestjs/common';

import { BaseCryptocurrency } from '../base.cryptocurrency';

import { ListInterface } from '../interfaces/list.interface';

@Injectable()
export class BinanceService extends BaseCryptocurrency {
    protected async setPairs(): Promise<void> {
        this.pairs = this.formatData(await this.getExchangeInfo('https://api.binance.com/api/v3/exchangeInfo'));
    }

    protected formatData(data: Array<any>): Array<ListInterface> {
        return data.filter(f => f.status === 'TRADING' && (f.quoteAsset === 'USDT' || f.quoteAsset === 'RUB' || f.quoteAsset === 'EUR')).map(s => { return { base: s.baseAsset, quote: s.quoteAsset, symbol: s.symbol } });
    }
}