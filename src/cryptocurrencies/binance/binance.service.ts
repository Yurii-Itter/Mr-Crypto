import { Injectable } from '@nestjs/common';

import { BaseCryptocurrency } from '../base.cryptocurrency';

import { SymbolInterface } from '../interfaces/symbol.interface';

@Injectable()
export class BinanceService extends BaseCryptocurrency {

    protected async symbolHandler(): Promise<void> {

        let raw = await this.getExchangeInfo('https://api.binance.com/api/v3/exchangeInfo');
        let trading = raw.data.symbols.filter(({ status }) => status === 'TRADING');

        this.stream = trading.reduce(
            (accum: string, { symbol }, index: number, array: Array<any>) => {

                array.length - 1 === index ?
                    accum += `${symbol.toLowerCase()}@ticker` :
                    accum += `${symbol.toLowerCase()}@ticker/`;

                return accum;
            }, ''
        );

        this.symbols = trading.reduce(
            (accum: SymbolInterface, { symbol, baseAsset, quoteAsset }) => {

                accum[baseAsset] ?
                    accum[baseAsset] = [...accum[baseAsset], { quote: quoteAsset, symbol: symbol.toLowerCase() }] :
                    accum[baseAsset] = [{ quote: quoteAsset, symbol: symbol.toLowerCase() }];

                return accum;
            }, {}
        );
    }

    protected async streamHandler(): Promise<void> {

        this.stream = await this.getAllMarketTickersStream(`wss://stream.binance.com:9443/stream?streams=${this.stream}`);

        this.stream.on('open', () => {
            this.logger.log('Binance all market tickers stream was opened');
        });

        this.stream.on('message', (msg: string) => {
            let { P, p, h, l, c, s } = JSON.parse(msg).data;
            this.list[s.toLowerCase()] = { last: c, high: h, low: l, change: p, percent: P };
        });

        this.stream.on('ping', () => {
            this.stream.pong('pong');
        })

        this.stream.on('close', () => {
            this.logger.log('Binance all market tickers stream was closed');
        });
    }
}