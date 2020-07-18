import { Document } from 'mongoose';

export interface ChatInterface extends Document {
  chatId: number;
  firstName: string;
  lastName: string;
  lang: string;
  sub: [
    {
      symbol: string;
      period: {
        days: [number];
        hour: number;
        minute: number;
      };
    },
  ];
  location: {
    latitude: number;
    longitude: number;
  };
  timeZone: {
    dstOffset: number;
    rawOffset: number;
    timeZoneId: string;
    timeZoneName: string;
  };
  p: boolean;
}
