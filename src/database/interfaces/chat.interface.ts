import { Document } from 'mongoose';

import { LocationInterface } from '../../common/interfaces/location.interface';

export interface ChatInterface extends Document {
  id: number;
  first_name: string;
  last_name?: string;
  language_code: string;
  subscriptions?: {
    symbol: string;
    period: {
      days: number[];
      hour: number;
      minute: number;
    };
  }[];
  location?: LocationInterface;
  timeZoneId?: string;
}
