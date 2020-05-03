import { Document } from 'mongoose';

export interface ChatInterface extends Document {
    chatId: number;
    fullName: string;
    lang: string;
    p: boolean;
}