import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema({
    chatId: Number,
    fullName: String,
    lang: String,
    p: Boolean
});