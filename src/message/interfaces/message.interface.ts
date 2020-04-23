import { EditInterface } from '../../common/interfaces/edit.interface';

export interface MessageInterface {
    chatId: number;
    messageId: number;
    lang: string;
    text: string;
    fullName: string;
    data: string;
    edit: EditInterface;
    getReplyStatus: () => string;
    getReplyData: () => any;
    setStatus: (status: string) => MessageInterface;
    withData: (data: any) => MessageInterface;
    withEdit: (options: EditInterface) => MessageInterface;
    answer: (args: any, edit: EditInterface) => string | void;
}