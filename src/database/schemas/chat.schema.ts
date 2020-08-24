import * as mongoose from 'mongoose';

import { SubscribtionSchema } from './subscription.schema';

export const ChatSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: false, trim: true },
  language_code: { type: String, required: true },

  subscriptions: { type: [SubscribtionSchema], required: false },
  timeZoneId: { type: String, required: false },
});
