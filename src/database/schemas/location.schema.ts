import * as mongoose from 'mongoose';

export const LocationSchema = new mongoose.Schema({
  latitude: { type: Number },
  longitude: { type: Number },
});
