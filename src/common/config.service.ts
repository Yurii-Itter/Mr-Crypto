import * as envalid from 'envalid';
const { str, port } = envalid;

export class ConfigService {
    private readonly envConfig: Record<string, string>;

    constructor() {
        this.envConfig = envalid.cleanEnv(process.env, {
            APP_PORT: port({ default: 3000 }),
            TELEGRAM_BOT_TOKEN: str(),
            DATABASE_URL: str()
        });
    }

    public get(key: string): string {
        return this.envConfig[key];
    }
}