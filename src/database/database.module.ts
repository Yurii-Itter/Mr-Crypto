import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseAutoIncrementID } from 'mongoose-auto-increment-reworked';
import { DatabaseService } from './database.service';

import { ChatSchema } from './schemas/chat.schema';

@Module({
    imports: [MongooseModule.forFeatureAsync([
        {
            name: 'Chat',
            useFactory: () => {
                const schema = ChatSchema;
                schema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Chat' });
                return schema;
            },
        },
    ])],
    providers: [DatabaseService],
    exports: [DatabaseService]
})
export class DatabaseModule { }