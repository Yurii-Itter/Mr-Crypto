import { Message } from 'telegraf/typings/telegram-types';

export interface TelegramMessageInterface {
  chatId: number;
  messageId: number;
  lang: string;
  text: string;
  firstName: string;
  lastName: string;
  data: any;
  location: any;
  edit: boolean;
  subscription: boolean;
  getReplyData: () => any;
  getReplyAction: () => string;
  withAction: (action: string) => TelegramMessageInterface;
  withData: (data: any) => TelegramMessageInterface;
  withEdit: () => TelegramMessageInterface;
  withoutEdit: () => TelegramMessageInterface;
  answer: (args: any, edit: boolean) => Promise<boolean | Message>;
}
