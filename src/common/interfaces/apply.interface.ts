import { InlineInterface } from './inline.interface';

export interface ApplyInterface {
    content: any,
    keyboard?: Array<Array<string>>,
    inline?: Array<Array<InlineInterface>>
}