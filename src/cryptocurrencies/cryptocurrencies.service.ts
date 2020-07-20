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

  public getBase(): string[] {
    const bases = [...Object.keys(this.binanceService.symbols)];
    return [...new Set(bases)];
  }

  public getSymbols(): string[] {
    const symbols = [...Object.keys(this.binanceService.formated)];
    return [...new Set(symbols)];
  }

  public getQuote(base: string): SymbolValueInterface[] {
    const quotes = [...this.binanceService.symbols[base]];
    return [...new Set(quotes)];
  }

  public getFormated(symbol: string): string {
    return this.binanceService.formated[symbol];
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
