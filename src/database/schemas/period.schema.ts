import * as mongoose from 'mongoose';

export const PeriodSchema = new mongoose.Schema({
  days: [{ type: Number }],
  hour: { type: Number },
  minute: { type: Number },
});
