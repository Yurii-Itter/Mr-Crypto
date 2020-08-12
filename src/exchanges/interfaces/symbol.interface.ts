import { SymbolValueInterface } from './symbol-value.interface';

export interface SymbolInterface {
  [base: string]: SymbolValueInterface[];
}
