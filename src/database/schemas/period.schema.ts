import * as mongoose from 'mongoose';

export const PeriodSchema = new mongoose.Schema({
  day: { type: Number },
  hour: { type: Number },
  minute: { type: Number },
});