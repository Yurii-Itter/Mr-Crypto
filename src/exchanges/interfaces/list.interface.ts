export interface ListInterface {
  [symbol: string]: {
    last: string;
    high: string;
    low: string;
    change: string;
    percent: string;
    direction: boolean;
  };
}
