import { Injectable } from '@nestjs/common';

import { BaseExchange } from '../base.exchange';

@Injectable()
export class BinanceService extends BaseExchange {
  public async symbols(): Promise<string[]> {
    return (
      await this.getExchangeInfo('https://api.binance.com/api/v3/exchangeInfo')
    ).data.symbols
      .filter(({ status }) => status === 'TRADING')
      .map(
        ({ baseAsset, quoteAsset }) =>
          `${baseAsset}-${quoteAsset === 'USDT' ? 'USD' : quoteAsset}`,
      );
  }

  public async streamHandler(symbols: string[]): Promise<void> {
    this.stream = await this.getAllMarketTickersStream(
      `wss://stream.binance.com:9443/stream?streams=${symbols.reduce(
        (accum: string, symbol, index: number, array: any[]) => {
          array.length - 1 === index
            ? (accum += `${symbol
                .replace('-', '')
                .replace('USD', 'USDT')
                .toLowerCase()}@ticker`)
            : (accum += `${symbol
                .replace('-', '')
                .replace('USD', 'USDT')
                .toLowerCase()}@ticker/`);

          return accum;
        },
        '',
      )}`,
    );

    this.stream.on('open', () => {
      this.logger.log('Binance all market tickers stream was opened');
    });

    this.stream.on('message', (msg: string) => {
      const { P, p, h, l, c, s } = JSON.parse(msg).data;
      this.list[s.replace('USDT', 'USD')] = {
        last: this.util.cut(c),
        high: this.util.cut(h),
        low: this.util.cut(l),
        change: this.util.cut(p),
        percent: P.replace(/(\.\d{2}).+/, '$1'),
        direction: +this.util.cut(p) > 0,
      };
    });

    this.stream.on('ping', () => {
      this.stream.pong('pong');
    });

    this.stream.on('close', () => {
      this.logger.log('Binance all market tickers stream was closed');
    });
  }
}
