import * as mongoose from 'mongoose';

import { PeriodSchema } from './period.schema';

export const SubscribtionSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  period: PeriodSchema,
});
