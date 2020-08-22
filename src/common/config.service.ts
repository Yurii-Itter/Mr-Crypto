import { port, str, cleanEnv } from 'envalid';

export class ConfigService {
  private envConfig: Record<string, string>;

  constructor() {
    this.envConfig = cleanEnv(process.env, {
      APP_PORT: port({ default: 3000 }),
      TELEGRAM_BOT_TOKEN: str(),
      GOOGLE_KEY: str(),
      DATABASE_URL: str(),
      ALLOWED_BASES: str(),
      ALLOWED_QUOTES: str(),
    });
  }

  public get(key: string): string {
    return this.envConfig[key];
  }
}
