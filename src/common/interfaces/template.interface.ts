import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export interface TemplateInterface {
  text: string;
  extra?: ExtraReplyMessage;
}
