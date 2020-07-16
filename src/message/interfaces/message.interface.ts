export interface MessageInterface {
  chatId: number;
  messageId: number;
  lang: string;
  text: string;
  firstName: string;
  lastName: string;
  data: any;
  location: any;
  edit: boolean;
  getReplyData: () => any;
  getReplyAction: () => string;
  withAction: (action: string) => MessageInterface;
  withData: (data: any) => MessageInterface;
  withEdit: () => MessageInterface;
  withoutEdit: () => MessageInterface;
  answer: (args: any, edit: boolean) => string;
}
