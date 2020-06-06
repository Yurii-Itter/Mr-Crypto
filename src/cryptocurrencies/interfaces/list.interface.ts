export interface ListInterface {
  [symbol: string]: {
    last: number;
    high: number;
    low: number;
    change: number;
    percent: number;
  };
}
