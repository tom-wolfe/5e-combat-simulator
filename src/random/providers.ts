import { RandomProvider } from 'dice-typescript';

export class AverageProvider implements RandomProvider {
  numberBetween(min: number, max: number): number {
    return (max + min) / 2;
  }
}

export class MaxProvider implements RandomProvider {
  numberBetween(min: number, max: number): number {
    return max;
  }
}
