import { Module } from '@nestjs/common';

import { BinanceService } from './binance.service';

import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [BinanceService],
  exports: [BinanceService],
})
export class BinanceModule {}
