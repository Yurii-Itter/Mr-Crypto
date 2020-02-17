import { Module } from '@nestjs/common';
import { StartAction } from './start_action';
import { CommonModule } from '../common/common.module'

@Module({
    imports: [CommonModule],
    providers: [StartAction],
    exports: [StartAction],
})
export class ActionModule { }