import { Document } from 'mongoose';

export interface ChatInterface extends Document {
    id: Number;
    chatId: Number;
    fullName: String;
    lang: String;
}