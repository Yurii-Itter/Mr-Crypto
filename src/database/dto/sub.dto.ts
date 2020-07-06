export class SubDto {
  chatId: number;
  sub: {
    symbol: string;
    period: [{
      day: number;
      hour: number;
      minute: number;
    }];
  };
}
