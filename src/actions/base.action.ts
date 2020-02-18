import { Injectable, Logger } from '@nestjs/common';
import { MessageInterface } from '../message/interfaces/message.interface';
import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event.service';
import { TemplateService } from '../common/template.service';

@Injectable()
export class BaseAction {
    protected appEmitter: AppEmitter;
    protected config: ConfigService;
    protected logger: Logger;

    protected templateService: TemplateService;

    protected event: string;

    constructor(
        config: ConfigService,
        appEmitter: AppEmitter,
        logger: Logger,
        templateService: TemplateService
    ) {
        this.config = config;
        this.logger = logger;

        this.appEmitter = appEmitter;
        this.templateService = templateService;

        this.setEvent();

        this.logger.log(`subscribe on "${this.event}" event`);
        this.appEmitter.on(this.event, this.handleEvent.bind(this));
    }

    protected setEvent(): void {
        throw new Error('not implemented');
    }

    protected async doAction(chat: number, message: MessageInterface): Promise<MessageInterface> {
        throw new Error('not implemented');
    }

    private async handleEvent(message: MessageInterface) {
        try {
            this.logger.log(`"${this.event}" event received`);

            const chatId: number = message.chatId;
            message = await this.doAction(chatId, message);

            message.answer(
                this.templateService.parseKeyboard(
                    this.templateService.apply(
                        {
                            action: this.event,
                            status: message.getReplyStatus(),
                            lang: message.lang,
                        },
                        message.getReplyData(),
                    )
                ),
            );
        } catch (error) {
            this.logger.error(error);
            message.answer(error.message);
        }
    }
}