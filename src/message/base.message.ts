import { MessageInterface } from '../message/interfaces/message.interface';

export class BaseMessage implements MessageInterface {
  public chatId: number;
  public messageId: number;
  public lang: string;
  public text: string;
  public data: any;
  public firstName: string;
  public lastName: string;
  public location: any;
  public edit: boolean;

  protected replyData: any;
  protected replyAction: string;

  public getReplyData(): any {
    return this.replyData;
  }

  public getReplyAction(): string {
    return this.replyAction;
  }

  public withAction(action: string): MessageInterface {
    this.replyAction = action;
    return this;
  }

  public withData(data: any): MessageInterface {
    this.replyData = this.replyData ? { ...this.replyData, ...data } : data;
    return this;
  }

  public withEdit(): MessageInterface {
    this.edit = true;
    return this;
  }

  public withoutEdit(): MessageInterface {
    this.edit = false;
    return this;
  }

  public answer(args: any, edit: boolean): string {
    throw new Error('not implemented');
  }
}
