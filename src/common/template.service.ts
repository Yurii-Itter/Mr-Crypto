import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { readDirDeepSync } from 'read-dir-deep';
import { Extra, Markup } from 'telegraf';

import { Injectable, Logger } from '@nestjs/common';

import { TemplateInterface } from './interfaces/template.interface';

@Injectable()
export class TemplateService {
  private readonly TEMPLATE_PATH: string = 'templates';

  private logger: Logger;
  private templatesMap: Map<string, (data: any) => string>;

  constructor(logger: Logger) {
    this.logger = logger;

    //todo
    handlebars.registerHelper('toggle', state => {
      if (state === 'son') {
        return 'soff';
      } else if (state === 'off' || state === 'soff') {
        return 'on';
      } else {
        return 'off';
      }
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
      const [, lang, action] = fileName.replace(/\.hbs$/, '').split('/');

      return acc.set(`${lang}-${action}`, handlebars.compile(template));
    }, new Map());
  }

  // private getTemplate(language_code: string, action: string): (data: any) => string {
  //   return this.templatesMap.get(this.getTemplateKey(language_code, action));
  // }

  // private getTemplateKey(lang: string, action: string): string {
  //   return `${lang}-${action}`;
  // }

  // public apply(language_code: string, action: string, data: any): string {
  //   const template = this.getTemplate(language_code, action)(data);

  //   if (!template) {
  //     throw new Error('template-not-found');
  //   }

  //   return template;
  // }

  private getContent(raw: string): string {
    return raw.replace(/[^\n\S]+(.+)/g, '$1')
      .replace(/>\n([^<\n])/g, '>$1')
      .replace(/([^>\n])\n</g, '$1<')
      .match(/(?:.|\n)*(<content>(?:.|\n)*<\/content>)/)[1]
      .replace(/\s*\n?<\/?content>\n?\s*/g, '');
  }

  private getKeyboard(raw: string) {
    const type = raw.match(
      /<(keyboard|inline)>(?:.|\n)+<\/(?:keyboard|inline)>/,
    );

    if (!type) {
      return null;
    }

    const buttons = raw
      .match(new RegExp(`<${type[1]}>(?:.|\n)*<\/${type[1]}>`))[0]
      .replace(/<\/?keyboard>/g, '')
      .replace(/\n/g, '')
      .replace(/>\s+</g, '><')
      .replace(/[^<]+/, '')
      .match(/(<line>(.+?)<\/line>)/g)
      .reduce((accum, line) => {
        const keys = line.match(/<key.+?<\/key>/g);
        if (type[1] === 'inline') {
          accum.push();
        } else if (type[1] === 'keyboard') {
          accum.push();
        }
        return accum;
      }, [])
    // .replace(/<\/?keyboard>/g, '')
    // .replace(/\n/g, '')
    // .replace(/>\s+</g, '><')
    // .replace(/[^<]+/, '')
    // .match(/(<line>(.+?)<\/line>)/g)

    return buttons;
    // .reduce((accum, line) => {
    //   if (type === 'inline') {
    //     accum.push()
    //   } else if (type === 'keyboard') {

    //   }
    //   return accum
    // }, []);
    // .forEach((line: string) => {
    //   keyboard.push(
    //     line.match(/<key.+?<\/key>/g).map(k => {
    //       return {
    //         action: k.match(/.+action="/)
    //           ? k.replace(/.+action="/, '').replace(/".+/, '')
    //           : undefined,
    //         key: k.replace(/<\/?key[^>]*>/g, ''),
    //       };
    //     }),
    //   );
    // });
  }

  public apply(lang: string, action: string, data: any) {
    const raw = this.templatesMap.get(`${lang}-${action}`)(data);
    const content = this.getContent(raw);
    const keyboard = this.getKeyboard(raw);
    console.log(keyboard);
  }
}
