export type INT32 = number
export type INT16 = number

export default class GaroDeviceDataResponse {
  array: number[];

  constructor(arr: number[]) {
    this.array = arr;
  }

  shiftNextINT16(): INT16 {
    if (!this.array)
      throw Error('Unexpected end of data!?');

      const shift = this.array.shift();
      if(shift == undefined)
        throw Error('Unexpected end of data!?!');
      else
        return shift;
  }

  shiftNextINT32(): INT32 {
    const shift1 = this.array.shift();
    const shift2 = this.array.shift();

    if(shift1 == undefined || shift2 == undefined)
      throw Error('Unexpected end of data!?!?');

    return ((shift2 << 16) | shift1);
  }
}
