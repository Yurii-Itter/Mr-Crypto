import { Injectable, Inject, Logger } from '@nestjs/common';

import { ConfigService } from '../common/config.service';
import { AppEmitter } from '../common/event.service';
import { TemplateService } from '../common/template.service';
import { DatabaseService } from '../database/database.service';
import { CryptocurrenciesService } from '../cryptocurrencies/cryptocurrencies.service';

import { MessageInterface } from '../message/interfaces/message.interface';
import { ChatInterface } from '../database/interfaces/chat.interface';

@Injectable()
export class Action {
  protected appEmitter: AppEmitter;
  protected config: ConfigService;
  protected logger: Logger;

  protected templateService: TemplateService;
  protected databaseService: DatabaseService;

  protected action: string;
  protected buttons: string[];

  constructor(
    @Inject('CryptocurrenciesServiceInstance')
    protected cryptocurrenciesService: CryptocurrenciesService,
    config: ConfigService,
    appEmitter: AppEmitter,
    logger: Logger,
    templateService: TemplateService,
    databaseService: DatabaseService,
  ) {
    this.config = config;
    this.logger = logger;

    this.appEmitter = appEmitter;
    this.templateService = templateService;
    this.databaseService = databaseService;

    this.setEvent();

    this.logger.log(`subscribed on ${this.action} event`);
    this.appEmitter.on(this.action, this.handleEvent.bind(this));
  }

  protected setEvent(): void {
    throw new Error('not implemented');
  }

  protected async doAction(
    chat: ChatInterface,
    msg: MessageInterface,
  ): Promise<MessageInterface> {
    throw new Error('not implemented');
  }

  private async handleEvent(msg: MessageInterface) {
    try {
      const chat: ChatInterface = await this.databaseService.ensureChat(msg);
      const message: MessageInterface = await this.doAction(chat, msg);

      message.answer(
        this.templateService.getKeyboard(
          this.templateService.apply(
            {
              action: this.action,
              status: message.getReplyStatus(),
              lang: chat.lang,
            },
            message.getReplyData(),
          ),
        ),
        message.edit,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
