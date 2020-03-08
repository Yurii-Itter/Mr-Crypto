import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event.service';
import { TemplateService } from '../common/template.service';
import { TelegramService } from '../telegram/telegram.service';
import { DatabaseService } from '../database/database.service';
import { CryptocurrenciesService } from '../cryptocurrencies/cryptocurrencies.service';

import { MessageInterface } from '../message/interfaces/message.interface';
import { ChatInterface } from '../database/interfaces/chat.interface';

@Injectable()
export class BaseAction {
    protected appEmitter: AppEmitter;
    protected config: ConfigService;
    protected logger: Logger;

    protected templateService: TemplateService;
    protected telegramService: TelegramService;
    protected databaseService: DatabaseService;
    protected cryptocurrenciesService: CryptocurrenciesService;

    protected event: string;
    protected buttons: Array<string>;

    constructor(
        config: ConfigService,
        appEmitter: AppEmitter,
        logger: Logger,
        templateService: TemplateService,
        telegramService: TelegramService,
        databaseService: DatabaseService,
        cryptocurrenciesService: CryptocurrenciesService
    ) {
        this.config = config;
        this.logger = logger;

        this.appEmitter = appEmitter;
        this.templateService = templateService;
        this.telegramService = telegramService;
        this.databaseService = databaseService;
        this.cryptocurrenciesService = cryptocurrenciesService;

        this.setEvent();
        this.setButtons();

        this.logger.log(`subscribe on "${this.event}" event`);
        this.appEmitter.on(this.event, this.handleEvent.bind(this));
    }

    protected setEvent(): void {
        throw new Error('not implemented');
    }

    protected setButtons(): void {
        throw new Error('not implemented');
    }

    protected async doAction(chat: ChatInterface, message: MessageInterface): Promise<MessageInterface> {
        throw new Error('not implemented');
    }

    private async handleEvent(message: MessageInterface) {
        try {
            this.logger.log(`"${this.event}" event received`);

            const chat: ChatInterface = await this.databaseService.ensureChat(message);
            message = await this.doAction(chat, message);

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