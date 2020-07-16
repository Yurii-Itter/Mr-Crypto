import axios from 'axios';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '../common/config.service';

import { LocationInterface } from './interfaces/location.interface';
import { TimeZoneInterface } from './interfaces/time-zone.interface';

@Injectable()
export class GoogleTimeZoneService {
  private config: ConfigService;

  constructor(config: ConfigService) {
    this.config = config;
  }

  public async getTimezone({
    latitude,
    longitude,
  }: LocationInterface): Promise<TimeZoneInterface> {
    return (
      await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Date.now() /
          1000}&key=${this.config.get('GOOGLE_KEY')}`,
      )
    ).data;
  }
}
