import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { readDirDeepSync } from 'read-dir-deep';

import { Injectable, Logger } from '@nestjs/common';

import { ParamsInterface } from './interfaces/params.interface';
import { ApplyInterface } from './interfaces/apply.interface';
import { KeyboardInterface } from '../common/interfaces/keyboard.interface';

@Injectable()
export class TemplateService {
  private readonly DEFAULT_LANG: string = 'en';
  private readonly TEMPLATE_PATH: string = 'templates';

  private logger: Logger;
  private templatesMap: Map<string, (d: any) => string>;

  constructor(logger: Logger) {
    this.logger = logger;

    handlebars.registerHelper('bool', bool => {
      return !bool;
    });

    this.load();
  }

  public apply(params: ParamsInterface, data: any): string {
    let template = this.getTemplate(params);

    if (!template) {
      params.lang = this.DEFAULT_LANG;
      template = this.getTemplate(params);
    }

    if (!template) {
      throw new Error('template-not-found');
    }

    return template(data);
  }

  public getKeyboard(template: any): ApplyInterface {
    const [, type] = template.match(
      /<(keyboard|inline)>(?:.|\n)+<\/(?:keyboard|inline)>/,
    );

    const content = template
      .replace(/[^\n\S]+(.+)/g, '$1')
      .replace(/>\n([^<\n])/g, '>$1')
      .replace(/([^>\n])\n</g, '$1<')
      .match(/(?:.|\n)*(<content>(?:.|\n)*<\/content>)/)[1]
      .replace(/\s*\n?<\/?content>\n?\s*/g, '');

    return type
      ? {
          type,
          keyboard: this.parseKeyboard(template, type),
          content,
        }
      : {
          type: undefined,
          content,
        };
  }

  private parseKeyboard(template: any, type: string): KeyboardInterface[][] {
    const keyboard = [];

    template
      .match(new RegExp(`<${type}>(?:.|\n)*<\/${type}>`))[0]
      .replace(/<\/?keyboard>/g, '')
      .replace(/\n/g, '')
      .replace(/>\s+</g, '><')
      .replace(/[^<]+/, '')
      .match(/(<line>(.+?)<\/line>)/g)
      .forEach((line: string) => {
        keyboard.push(
          line.match(/<key.+?<\/key>/g).map(k => {
            return {
              action: k.match(/.+action="/)
                ? k.replace(/.+action="/, '').replace(/".+/, '')
                : undefined,
              key: k.replace(/<\/?key[^>]*>/g, ''),
            };
          }),
        );
      });

    return keyboard;
  }

  private getTemplate(params: ParamsInterface): (data: any) => string {
    const { lang, action } = params;
    return this.templatesMap.get(this.getTemplateKey(lang, action));
  }

  private load() {
    const templatesDir: string = path.join(process.cwd(), this.TEMPLATE_PATH);
    const templateFileNames: string[] = readDirDeepSync(templatesDir);

    this.templatesMap = templateFileNames.reduce((acc, fileName) => {
      const template = fs.readFileSync(fileName, { encoding: 'utf-8' });

      const [, lang, action] = fileName.replace(/\.hbs$/, '').split('/');
      return acc.set(
        this.getTemplateKey(lang, action),
        handlebars.compile(template),
      );
    }, new Map());
  }

  private getTemplateKey(lang: string, action: string): string {
    return `${lang}-${action}`;
  }
}
