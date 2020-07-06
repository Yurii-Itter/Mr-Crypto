import * as mongoose from 'mongoose';

import { LocationSchema } from './location.schema';
import { TimeZoneSchema } from './time-zone.schema';
import { SubSchema } from './sub.schema';

export const ChatSchema = new mongoose.Schema({
  chatId: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  lang: { type: String, default: 'en' },
  sub: [SubSchema],
  location: {
    type: LocationSchema,
    default: undefined,
  },
  timeZone: {
    type: TimeZoneSchema,
    default: undefined,
  },
  p: { type: Boolean, default: false },
});
