import { IMessage } from '../message/i-message';

export class BaseMessage implements IMessage {
    public chatId: number;
    public lang: string;
    public text: string;
    public fullText: string;
    public command: string;

    protected firstName: string;
    protected lastName: string;

    protected replyStatus: string;
    protected replyData: any;

    get name(): string {
        const firstName: string = this.firstName || '';
        const lastName: string = this.lastName || '';

        return `${firstName} ${lastName}`.trim();
    }

    public getReplyStatus(): string {
        return this.replyStatus;
    }

    public getReplyData(): any {
        return this.replyData;
    }

    public setStatus(status: string): IMessage {
        this.replyStatus = status;
        return this;
    }

    public withData(data: any): IMessage {
        this.replyData = data;
        return this;
    }

    public answer(args: any): string | void {
        throw new Error('not implemented');
    }
}