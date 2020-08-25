import { Module } from '@nestjs/common';

import { CoinbaseService } from './coinbase.service';

import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [CoinbaseService],
  exports: [CoinbaseService],
})
export class CoinbaseModule {}
