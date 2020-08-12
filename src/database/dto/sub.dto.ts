export class SubscriptionDto {
  symbol: string;
  period: {
    days: [number];
    hour: number;
    minute: number;
  };
}
