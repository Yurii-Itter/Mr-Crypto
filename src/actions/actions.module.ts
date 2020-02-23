import { Module } from '@nestjs/common';

import { StartAction } from './start_action';
import { CommonModule } from '../common/common.module'
import { TelegramModule } from '../telegram/telegram.module';

@Module({
    imports: [CommonModule, TelegramModule],
    providers: [StartAction],
    exports: [StartAction],
})
export class ActionModule { }