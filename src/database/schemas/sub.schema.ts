import * as mongoose from 'mongoose';

import { PeriodSchema } from './period.schema';

export const SubSchema = new mongoose.Schema({
  symbol: { type: String },
  period: PeriodSchema,
});
