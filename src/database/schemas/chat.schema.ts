import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    chatId: { type: Number, required: true },
    fullName: { type: String, required: true },
    lang: { type: String, required: true }
});