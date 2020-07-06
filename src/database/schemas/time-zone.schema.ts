import * as mongoose from 'mongoose';

export const TimeZoneSchema = new mongoose.Schema({
  dstOffset: { type: Number },
  rawOffset: { type: Number },
  timeZoneId: { type: String },
  timeZoneName: { type: String },
});