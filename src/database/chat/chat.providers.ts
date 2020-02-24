import { Connection } from 'mongoose';

import { ChatSchema } from '../schemas/chat.schema';
import { DATABASE_CONNECTION, CHAT_MODEL } from '../constants';

export const chatProviders = [
    {
        provide: CHAT_MODEL,
        useFactory: (connection: Connection) => connection.model('Chat', ChatSchema),
        inject: [DATABASE_CONNECTION],
    },
];