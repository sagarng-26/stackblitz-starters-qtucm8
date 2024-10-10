import 'zone.js';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    Enter number for addition
    <input type="text" #input>
    <button (click)="calculate(input.value)"> Add</button>
    <div>Addition is {{ total }} </div>
    <div [style.color]="'red'">{{ error }} </div>
  `,
})
export class App {
  public total = 0;
  error: any = null;

  constructor() {
    /* Tested inputs
    //;\n1;2;3\n4;5;6\n7;8;9;abc
    \n1,2,3\n4,5,6\n7,8,9,abc
    1,2,3,4,5,6,7,8,9
    1,-2,3,4,5,-6,7,8,-9
    '' (empty)
    1
    1, 5
    1\n, 2, 3
    //;\n1;-2;3;-10
    //#\n1#-2#3#-11\n8#20
    */
  }

  public calculate(inputValue: string): void {
    try {
      this.total = this.sum(inputValue);
      this.error = null;
    } catch (error) {
      this.total = 0;
      this.error = error;
    }
  }

  public sum(value: string) {
    // trim to remove empty spaces
    const trimmedValue = value ? value.trim() : value;
    if (trimmedValue === '') {
      return 0;
    }
    // set delimiter default to comma
    let delimiter = ',';
    // If string starts with // means it has delimiter
    if (trimmedValue.startsWith('//')) {
      // split by new line
      const byNewLine = trimmedValue.split('\\n');
      delimiter = byNewLine[0].slice(2);
      // exclude first array el (which is delimiter) and get remaining elements in rest array
      const [, ...rest] = byNewLine;
      // iterate each array and split each element by delimiter and add them
      const subTotals = rest.map((item) => this.sumList(item.split(delimiter)));
      // finally add final array
      return this.sumList(subTotals);

      // if input value does not starts with // then check if it has new line
    } else if (trimmedValue.includes('\\n')) {
      // split by new line
      const byNewLine = trimmedValue.split('\\n');
      // and split each line by delimiter and add item
      const subTotals = byNewLine.map((item) =>
        this.sumList(item.split(delimiter))
      );
      // add final array
      return this.sumList(subTotals);
    } else {
      // it it does not have delimiter mot contains newline then split and add numbers
      return this.sumList(trimmedValue.split(delimiter));
    }
    return 0;
  }

  private sumList(list: number[] | string[]): number {
    // parse each items
    const parsedNumbers = list.map((num) => this.parseInt(num));
    this.checkNegativeNumbers(parsedNumbers);
    return parsedNumbers.reduce((acc, item) => ((acc = acc + item), acc));
  }

  private parseInt(val: any): number {
    const temp = parseInt(val);
    return isNaN(temp) ? 0 : temp;
  }

  private checkNegativeNumbers(nums: number[]) {
    // check if any negative elements if yes throw exception
    const negativeNums = nums.filter((num) => num < 0);
    if (negativeNums.length) {
      throw Error(`Negative numbers not allowed ${negativeNums}`);
    }
  }
}

bootstrapApplication(App);
