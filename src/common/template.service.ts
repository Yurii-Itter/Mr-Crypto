import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { Extra, Markup } from 'telegraf';
import { readDirDeepSync } from 'read-dir-deep';

import { Injectable } from '@nestjs/common';

import { TemplateInterface } from './interfaces/template.interface';

import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { KeyboardButton, InlineKeyboardButton } from 'telegraf/typings/markup';

type Button = KeyboardButton | InlineKeyboardButton;

@Injectable()
export class TemplateService {
  private readonly TEMPLATE_PATH: string = 'templates';
  private templatesMap: Map<string, (values: any) => string>;

  constructor() {
    handlebars.registerHelper('toggle', state => {
      return state === 'son'
        ? 'soff'
        : state === 'off' || state === 'soff'
        ? 'on'
        : 'off';
    });

    handlebars.registerHelper('switch', state => {
      return state === 'off' || state === 'soff' ? false : true;
    });

    handlebars.registerHelper('inc', value => {
      return value + 1;
    });

    this.load();
  }

  private load(): void {
    const templatesDir = path.join(process.cwd(), this.TEMPLATE_PATH);
    const templateFileNames = readDirDeepSync(templatesDir);

    this.templatesMap = templateFileNames.reduce((acc, fileName) => {
      const template = fs.readFileSync(fileName, { encoding: 'utf-8' });
      const [, lang, event] = fileName.replace(/\.hbs$/, '').split('/');

      return acc.set(`${lang}-${event}`, handlebars.compile(template));
    }, new Map());
  }

  private getText(raw: string): string {
    return raw
      .replace(/[^\n\S]+(.+)/g, '$1')
      .replace(/>\n([^<\n])/g, '>$1')
      .replace(/([^>\n])\n</g, '$1<')
      .match(/(?:.|\n)*(<content>(?:.|\n)*<\/content>)/)[1]
      .replace(/\s*\n?<\/?content>\n?\s*/g, '');
  }

  private getRawKeyboard(raw: string): RegExpMatchArray {
    return raw
      .replace(/\n/g, '')
      .replace(/>\s+</g, '><')
      .match(/<(keyboard|inline)>(.+)<\/(?:keyboard|inline)>/);
  }

  private keyHandler(type: string, key: string): Button {
    const [, sub] =
      key.search(/sub="[^"]+"/) !== -1 ? key.match(/sub="([^"]+)"/) : '';
    const [, data] =
      key.search(/data="[^"]+"/) !== -1 ? key.match(/data="([^"]+)"/) : '';
    const [, text] = key.match(/<key[^>]*>([^<]+)<\/key>/);

    if (type === 'keyboard') {
      switch (sub) {
        case 'contact':
          return Markup.contactRequestButton(text);
        case 'location':
          return Markup.locationRequestButton(text);
        default:
          return text;
      }
    } else if (type === 'inline') {
      switch (sub) {
        case 'pay':
          return Markup.payButton(text);
        case 'game':
          return Markup.gameButton(text);
        case 'url':
          return Markup.urlButton(text, data);
        case 'chat':
          return Markup.switchToChatButton(text, data);
        case 'current':
          return Markup.switchToCurrentChatButton(text, data);
        default:
          return Markup.callbackButton(text, data);
      }
    }
  }

  private extraHanddler(type: string, keyboard: Button[][]): ExtraReplyMessage {
    if (type === 'keyboard') {
      return Extra.HTML().markup(
        Markup.keyboard(keyboard as KeyboardButton[][]).resize(),
      );
    } else if (type === 'inline') {
      return Extra.HTML().markup(
        Markup.inlineKeyboard(keyboard as InlineKeyboardButton[][]),
      );
    }
  }

  private formatKeyboard(type: string, lines: string): Button[][] {
    return lines.match(/<line>.+?<\/line>/g).map(line => {
      return line
        .match(/<key[^>]*>.+?<\/key>/g)
        .reduce((accum: Button[], key: string) => {
          const button = this.keyHandler(type, key);
          accum.push(button);
          return accum;
        }, []);
    });
  }

  public apply(lang: string, event: string, values?: any): TemplateInterface {
    const raw = this.templatesMap.get(`${lang}-${event}`)(values);

    const text = this.getText(raw);
    const rawKeyboar = this.getRawKeyboard(raw);

    if (rawKeyboar) {
      const [, type, lines] = rawKeyboar;
      const keyboard = this.formatKeyboard(type, lines);
      const extra = this.extraHanddler(type, keyboard);

      return { text, extra };
    }

    return { text, extra: { parse_mode: 'HTML' } };
  }
}
