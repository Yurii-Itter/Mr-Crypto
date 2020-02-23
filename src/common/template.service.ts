import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { readDirDeepSync } from 'read-dir-deep';
import { Injectable, Logger } from '@nestjs/common';

import { ParamsInterface } from './interfaces/params.interface';
import { ApplyInterface } from './interfaces/apply.interface';


@Injectable()
export class TemplateService {
    private readonly DEFAULT_LANG: string = 'en';
    private readonly TEMPLATE_PATH: string = 'templates';

    private logger: Logger;
    private templatesMap: Map<string, (d: any) => string>;

    constructor(logger: Logger) {
        this.logger = logger;

        this.load();
    }

    public apply(params: ParamsInterface, data: any): string {

        this.logger.log(
            `apply template: ${params.action} ${params.status} ${params.lang}`,
        );

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

    public parseKeyboard(template: any): ApplyInterface {

        let k = template.match(/(?:.|\n)*(<keyboard>(?:.|\n)*<\/keyboard>)/);

        let content = template.match(/(?:.|\n)*(<content>(?:.|\n)*<\/content>)/)[1].replace(/\s*\n?<\/?content>\n?\s*/g, '').replace(/(\n\s*\n)\s{2,}/g, '$1');

        if (k) {

            let keyboard = [];

            k[1].replace(/<\/?keyboard>/g, '').replace(/\n/g, '').replace(/>\s+</g, '><').replace(/[^<]+/, '').match(/(<keys>(.+?)<\/keys>)/g).forEach((keys: string) => {
                keyboard.push(keys.match(/(<key>(.+?)<\/key>)/g).map((ks: string) => {
                    return ks.replace(/<\/?key>/g, '')
                }));
            });

            return { htmlText: content, keyboard: keyboard }
        } else {
            return { htmlText: content }
        }
    }

    private getTemplate(params: ParamsInterface): (data: any) => string {
        const { lang, action, status } = params;
        return this.templatesMap.get(this.getTemplateKey(lang, action, status));
    }

    private load() {
        const templatesDir: string = path.join(
            process.cwd(),
            this.TEMPLATE_PATH,
        );
        const templateFileNames: string[] = readDirDeepSync(templatesDir);

        this.templatesMap = templateFileNames.reduce((acc, fileName) => {
            const template = fs.readFileSync(fileName, { encoding: 'utf-8' });

            const [, lang, action, status] = fileName
                .replace(/\.hbs$/, '')
                .split('/');
            return acc.set(
                this.getTemplateKey(lang, action, status),
                handlebars.compile(template),
            );
        }, new Map());
    }

    private getTemplateKey(
        lang: string,
        action: string,
        status: string,
    ): string {
        return `${lang}-${action}-${status}`;
    }
}