import { MessageInterface } from '../message/interfaces/message.interface';
import { EditInterface } from '../common/interfaces/edit.interface';

export class BaseMessage implements MessageInterface {
    public chatId: number;
    public messageId: number;
    public lang: string;
    public text: string;
    public data: string;
    public edit: EditInterface;

    protected firstName: string;
    protected lastName: string;

    protected replyStatus: string;
    protected replyData: any;

    get fullName(): string {
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

    public setStatus(status: string): MessageInterface {
        this.replyStatus = status;
        return this;
    }

    public withData(data: any): MessageInterface {
        this.replyData = data;
        return this;
    }

    public withEdit(options: EditInterface): MessageInterface {
        this.edit = options;
        return this;
    }

    public answer(args: any, edit: EditInterface): string | void {
        throw new Error('not implemented');
    }
}