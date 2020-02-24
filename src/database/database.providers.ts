import * as mongoose from 'mongoose';
import { ConfigService } from '../common/config.service';
import { DATABASE_CONNECTION } from './constants';

const config = new ConfigService;

export const databaseProviders = [
    {
        provide: DATABASE_CONNECTION,
        useFactory: (): Promise<typeof mongoose> => mongoose.connect(config.get('DATABASE_URL'), { useNewUrlParser: true, useUnifiedTopology: true })
    }
];