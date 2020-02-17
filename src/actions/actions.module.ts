import { Module } from '@nestjs/common';
import { ActionService } from './actions.service';

@Module({
    imports: [],
    providers: [ActionService],
    exports: [ActionService],
})
export class ActionModule { }