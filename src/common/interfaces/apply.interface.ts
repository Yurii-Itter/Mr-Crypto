import { QuoteInterface } from './quote.interface';

export interface ApplyInterface {
    content: any,
    keyboard?: Array<Array<string>>,
    inline?: Array<Array<QuoteInterface>>
}