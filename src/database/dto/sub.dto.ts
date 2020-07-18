export class SubDto {
  chatId: number;
  sub: {
    symbol: string;
    period: {
      days: [number];
      hour: number;
      minute: number;
    };
  };
}
