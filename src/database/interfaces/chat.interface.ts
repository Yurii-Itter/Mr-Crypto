import { Document } from 'mongoose';

export interface ChatInterface extends Document {
    _id: Number;
    chatId: Number;
    fullName: String;
    lang: String;
}