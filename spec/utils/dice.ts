import { RandomProvider } from 'dice-typescript';

export class ConstantProvider implements RandomProvider {
  constructor(private number: number) { }
  numberBetween(min: number, max: number): number {
    return this.number;
  }
}

export class SequentialProvider implements RandomProvider {
  constructor(private rolls: number[]) { }
  numberBetween(min: number, max: number): number {
    return this.rolls.splice(0, 1)[0];
  }
}
