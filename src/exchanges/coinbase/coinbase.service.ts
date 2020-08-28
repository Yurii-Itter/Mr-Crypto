import { Injectable } from '@nestjs/common';

import { BaseExchange } from '../base.exchange';

@Injectable()
export class CoinbaseService extends BaseExchange {
  public async symbols(): Promise<string[]> {
    return (
      await this.getExchangeInfo('https://api.pro.coinbase.com/products')
    ).data.map(({ id }) => id);
  }

  public async streamProcessor(): Promise<void> {
    this.stream = await this.getAllMarketTickersStream(
      'wss://ws-feed.pro.coinbase.com',
    );

    this.stream.on('open', () => {
      this.logger.log('Coinbase all market tickers stream was opened');
      this.stream.send(
        JSON.stringify({
          type: 'subscribe',
          product_ids: this.availableSymbols,
          channels: ['ticker'],
        }),
      );
    });

    this.stream.on('message', (msg: string) => {
      const parsed = JSON.parse(msg);
      const { type } = parsed;

      if (type === 'ticker') {
        const { product_id, price, high_24h, low_24h, open_24h } = parsed;
        this.list[product_id.replace('-', '')] = {
          last: this.util.cut(price),
          high: this.util.cut(high_24h),
          low: this.util.cut(low_24h),
          change: this.util.cut(this.util.change(price, open_24h)),
          percent: this.util.percent(price, open_24h),
          direction: +this.util.cut(this.util.change(price, open_24h)) > 0,
        };
      }
    });

    this.stream.on('close', async () => {
      this.logger.log('Coinbase all market tickers stream was closed');
      await this.streamProcessor();
    });
  }
}
