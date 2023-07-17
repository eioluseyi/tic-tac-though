import { TurnType } from "src/types";

export class SetGameCharacters {
  index: number;
  arr: TurnType[];

  constructor(arr: TurnType[]) {
    this.index = 0;
    this.arr = arr;
  }

  next() {
    if (this.index >= this.arr.length) {
      this.index = 0; // reset the index to 0
      return this.arr[this.index++];
    } else {
      return this.arr[this.index++];
    }
  }
}

/**
 * @function isEachEqual
 * @summary Check if each index of `arr` from `indexList` is equal to the next
 * @param indexList
 * @param arr
 */
export const isEachEqual = (
  indexList: number[],
  arr: (string | number | boolean | null)[]
) => {
  for (let i = 0; i < indexList.length; i++) {
    if (!arr[indexList[0]]) return false;
    if (arr[indexList[i]] !== arr[indexList[0]]) return false;
  }

  return true;
};

export const getWinArray = (arr: any[]) => {
  /**
   * [
   *   0  1  2
   *   3  4  5
   *   6  7  8
   * ]
   */

  let checkList: number[];

  // There has to be at least 5 pieces to win
  // 3 winning pieces and 2 of the opposition
  if (arr.length < 5) return [];

  checkList = [0, 1, 2];
  if (isEachEqual(checkList, arr)) return checkList;

  checkList = [0, 4, 8];
  if (isEachEqual(checkList, arr)) return checkList;

  checkList = [0, 3, 6];
  if (isEachEqual(checkList, arr)) return checkList;

  checkList = [1, 4, 7];
  if (isEachEqual(checkList, arr)) return checkList;

  checkList = [2, 5, 8];
  if (isEachEqual(checkList, arr)) return checkList;

  checkList = [2, 4, 6];
  if (isEachEqual(checkList, arr)) return checkList;

  checkList = [3, 4, 5];
  if (isEachEqual(checkList, arr)) return checkList;

  checkList = [6, 7, 8];
  if (isEachEqual(checkList, arr)) return checkList;

  checkList = [];
  return checkList;
};

export const getCellClasses = (index: number, winner: boolean) => {
  return `board-cell ${winner ? "winner" : ""} delay-${index % 3}`;
};
