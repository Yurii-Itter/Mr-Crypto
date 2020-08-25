import { Injectable } from '@nestjs/common';

import { UtilService } from '../common/util.service';
import { ConfigService } from '../common/config.service';
import { BinanceService } from './binance/binance.service';
import { CoinbaseService } from './coinbase/coinbase.service';

import { SymbolInterface } from './interfaces/symbol.interface';
import { FormatedInterface } from './interfaces/formated.interface';
import { SymbolValueInterface } from './interfaces/symbol-value.interface';

@Injectable()
export class ExchangeService {
  private util: UtilService;
  private configService: ConfigService;
  private binanceService: BinanceService;
  private coinbaseService: CoinbaseService;

  private coinbaseAvailable: string[];
  private binanceAvailable: string[];

  private symbols: SymbolInterface;
  private formated: FormatedInterface;

  constructor(
    util: UtilService,
    configService: ConfigService,
    binanceService: BinanceService,
    coinbaseService: CoinbaseService,
  ) {
    this.util = util;
    this.configService = configService;
    this.binanceService = binanceService;
    this.coinbaseService = coinbaseService;
  }

  private async symbolsHandler(): Promise<void> {
    const coinbase = await this.coinbaseService.symbols();
    const binance = await this.binanceService.symbols();

    const bases = this.configService.get('ALLOWED_BASES').split(' ');
    const quotes = this.configService.get('ALLOWED_QUOTES').split(' ');

    this.coinbaseAvailable = this.util.allowed(coinbase, bases, quotes);
    this.binanceAvailable = this.util.allowed(binance, bases, quotes);

    const mixed = this.util.sort(
      [...new Set([...this.coinbaseAvailable, ...this.binanceAvailable])],
      bases,
      quotes,
    );

    this.symbols = mixed.reduce((accum: SymbolInterface, symbol) => {
      const [base, quote] = symbol.split('-');

      accum[base]
        ? (accum[base] = [...accum[base], { quote, symbol: base + quote }])
        : (accum[base] = [{ quote, symbol: base + quote }]);

      return accum;
    }, {});

    this.formated = mixed.reduce((accum, symbol) => {
      const [base, quote] = symbol.split('-');
      accum[base + quote] = symbol;
      return accum;
    }, {});
  }

  public async launch(): Promise<void> {
    await this.symbolsHandler();
    await this.coinbaseService.streamHandler(this.coinbaseAvailable);
    await this.binanceService.streamHandler(this.binanceAvailable);
  }

  public getBase(): string[] {
    return Object.keys(this.symbols);
  }

  public getSymbols(): string[] {
    return Object.keys(this.formated);
  }

  public getQuote(base: string): SymbolValueInterface[] {
    return this.symbols[base];
  }

  public getFormated(symbol: string): string {
    return this.formated[symbol];
  }

  public getList(symbol: string): any[] {
    const list = [];

    if (Object.keys(this.coinbaseService.list).includes(symbol)) {
      list.push({
        source: 'Coinbase Pro',
        ...this.coinbaseService.list[symbol],
      });
    }

    if (Object.keys(this.binanceService.list).includes(symbol)) {
      list.push({
        source: 'Binance',
        ...this.binanceService.list[symbol],
      });
    }

    return list;
  }
}
