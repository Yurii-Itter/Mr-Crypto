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
  getReplyStatus: () => string;
  getReplyData: () => any;
  setStatus: (status: string) => MessageInterface;
  withData: (data: any) => MessageInterface;
  withEdit: () => MessageInterface;
  answer: (args: any, edit: boolean) => string;
}
