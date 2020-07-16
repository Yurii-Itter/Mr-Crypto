import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';

import { BinanceService } from './binance/binance.service';
import { TelegramService } from '../telegram/telegram.service';

import { SymbolValueInterface } from './interfaces/symbol-value.interface';

@Injectable()
export class CryptocurrenciesService {
  private logger: Logger;
  private binanceService: BinanceService;

  constructor(
    @Inject(forwardRef(() => 'TelegramServiceInstance'))
    private telegramService: TelegramService,
    binanceService: BinanceService,
    logger: Logger,
  ) {
    this.logger = logger;
    this.binanceService = binanceService;

    this.cryptocurrenciesLauncher();
  }

  private async cryptocurrenciesLauncher(): Promise<void> {
    await this.binanceService.launch();
    await this.telegramService.launch();
  }

  public getBaseKeyboard(): string[][] {
    let chunk = [];

    return this.getBase().reduce((accum, base, index, array) => {
      if (chunk.length === 2 || index === array.length - 1) {
        chunk.push({ base });
        accum.push({ chunk });
        chunk = [];
      } else {
        chunk.push({ base });
      }

      return accum;
    }, []);
  }

  public getBase(): string[] {
    const bases = [...Object.keys(this.binanceService.symbols)];
    return [...new Set(bases)];
  }

  public getQuoteKeyboard(base: string): string[][] {
    let chunk = [];

    return this.getQuote(base).reduce((accum, quote, index, array) => {
      if (chunk.length === 2 || index === array.length - 1) {
        chunk.push(quote);
        accum.push({ chunk });
        chunk = [];
      } else {
        chunk.push(quote);
      }

      return accum;
    }, []);
  }

  public getQuote(base: string): SymbolValueInterface[] {
    const quotes = [...this.binanceService.symbols[base]];
    return [...new Set(quotes)];
  }

  public getList(symbol: string) {
    return [
      {
        source: 'Binance',
        ...this.binanceService.list[symbol],
      },
    ];
  }
}
