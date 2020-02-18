export interface MessageInterface {
    chatId: number;
    lang: string;
    text: string;
    command: string;
    name: string;
    getReplyStatus: () => string;
    getReplyData: () => any;
    setStatus: (status: string) => MessageInterface;
    withData: (data: any) => MessageInterface;
    answer: (args: any) => string | void;
}