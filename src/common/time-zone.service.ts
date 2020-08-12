import axios from 'axios';

import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '../common/config.service';

import { LocationInterface } from './interfaces/location.interface';
import { TimeZoneInterface } from './interfaces/time-zone.interface';

@Injectable()
export class TimeZoneService {
  private logger: Logger;

  private config: ConfigService;

  constructor(config: ConfigService, logger: Logger) {
    this.logger = logger;
    this.config = config;
  }

  public async getTimezoe(
    { latitude, longitude }: LocationInterface,
    language_code: string,
  ): Promise<TimeZoneInterface> {
    try {
      return (
        await axios.get(
          `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Date.now() /
            1000}&key=${this.config.get(
            'GOOGLE_KEY',
          )}&language=${language_code}`,
        )
      ).data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
