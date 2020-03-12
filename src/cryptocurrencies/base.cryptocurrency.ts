import { Injectable, Logger } from '@nestjs/common';
import axios, {AxiosResponse} from 'axios';

import { ListInterface } from './interfaces/list.interface';

@Injectable()
export class BaseCryptocurrency {
    protected logger: Logger;
    protected pairs: Array<ListInterface>;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    protected async getExchangeInfo(link: string): Promise<AxiosResponse> {
        try {
            return (await axios.get(link));
        } catch (error) {
            this.logger.error(error);
        }
    }

    public async pairsHandler(): Promise<Array<ListInterface>> {
        throw new Error('not implemented');
    }
}