import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionService {
    public start(ctx) {
        const { message } = ctx.update;
        return message.text;
    }
}
