import { Injectable, Logger } from '@nestjs/common';

import { BinanceService } from './binance/binance.service';
import { CoinbaseService } from './coinbase/coinbase.service';

import { SymbolInterface } from './interfaces/symbol.interface';
import { FormatedInterface } from './interfaces/formated.interface';
import { SymbolValueInterface } from './interfaces/symbol-value.interface';

@Injectable()
export class ExchangeService {
  private logger: Logger;
  private binanceService: BinanceService;
  private coinbaseService: CoinbaseService;

  private available: string[];
  private symbols: SymbolInterface;
  private formated: FormatedInterface;

  constructor(
    binanceService: BinanceService,
    coinbaseService: CoinbaseService,
    logger: Logger,
  ) {
    this.logger = logger;
    this.binanceService = binanceService;
    this.coinbaseService = coinbaseService;
  }

  private async symbolsHandler(): Promise<void> {
    const coinbase = await this.coinbaseService.symbols();
    const binance = await this.binanceService.symbols();

    this.available = coinbase.filter(
      symbol =>
        binance.indexOf(symbol) !== -1 && symbol.split('-')[1] === 'USD',
    );

    this.symbols = this.available.reduce((accum: SymbolInterface, symbol) => {
      const [base, quote] = symbol.split('-');

      accum[base]
        ? (accum[base] = [...accum[base], { quote, symbol: base + quote }])
        : (accum[base] = [{ quote, symbol: base + quote }]);

      return accum;
    }, {});

    this.formated = this.available.reduce((accum, symbol) => {
      const [base, quote] = symbol.split('-');
      accum[base + quote] = symbol;
      return accum;
    }, {});
  }

  public async launch(): Promise<void> {
    await this.symbolsHandler();
    await this.coinbaseService.streamHandler(this.available);
    await this.binanceService.streamHandler(this.available);
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
    return [
      {
        source: 'Coinbase',
        ...this.coinbaseService.list[this.formated[symbol]],
      },
      {
        source: 'Binance',
        ...this.binanceService.list[symbol],
      },
    ];
  }
}
