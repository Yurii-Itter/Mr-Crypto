import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  public chunk(data: any[]): any[][] {
    let chunk = [];

    return data.reduce((accum, quote, index, array) => {
      if (chunk.length === 2 || index === array.length - 1) {
        chunk.push(quote);
        accum.push({ chunk });
        chunk = [];
      } else {
        chunk.push(quote);
      }

      return accum;
    }, []);
  }
}
