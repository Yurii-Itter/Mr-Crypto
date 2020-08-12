import { Injectable } from '@nestjs/common';

import { BaseExchange } from '../base.exchange';

@Injectable()
export class CoinbaseService extends BaseExchange {
  public async symbols(): Promise<string[]> {
    return (
      await this.getExchangeInfo('https://api.pro.coinbase.com/products')
    ).data.map(({ id }) => id);
  }

  public async streamHandler(symbols: string[]): Promise<void> {
    this.stream = await this.getAllMarketTickersStream(
      'wss://ws-feed.pro.coinbase.com',
    );

    this.stream.on('open', () => {
      this.logger.log('Coinbase all market tickers stream was opened');
      this.stream.send(
        JSON.stringify({
          type: 'subscribe',
          product_ids: symbols,
          channels: ['ticker'],
        }),
      );
    });

    this.stream.on('message', (msg: string) => {
      const { product_id, price, high_24h, low_24h, open_24h } = JSON.parse(
        msg,
      );
      if (product_id) {
        this.list[product_id] = {
          last: this.utilService.cut(price),
          high: this.utilService.cut(high_24h),
          low: this.utilService.cut(low_24h),
          change: this.utilService.cut(
            this.utilService.change(price, open_24h),
          ),
          percent: this.utilService.percent(price, open_24h),
        };
      }
    });

    this.stream.on('ping', () => {
      this.logger.log('Coinbase pong was sent');
      this.stream.pong('pong');
    });

    this.stream.on('close', () => {
      this.logger.log('Coinbase all market tickers stream was closed');
    });
  }
}
