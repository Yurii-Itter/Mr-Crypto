import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { chatProviders } from './chat.providers';
import { DatabaseModule } from '../database.module';

@Module({
    imports: [DatabaseModule],
    providers: [
        ChatService,
        ...chatProviders,
    ],
})
export class CatsModule { }