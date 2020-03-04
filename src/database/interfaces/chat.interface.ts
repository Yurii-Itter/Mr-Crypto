import { Document } from 'mongoose';

export interface ChatInterface extends Document {
    chatId: Number;
    fullName: String;
    lang: String;
    p: Boolean;
}