import { DiceRoller } from '@sim/encounter';
import { RollDice } from '@sim/random';
import { DefaultRandomProvider, Dice, RandomProvider } from 'dice-typescript';

export class DefaultDiceRoller implements DiceRoller {
  random: RandomProvider;
  roll: RollDice;

  constructor() {
    this.random = new DefaultRandomProvider();
    const dice = new Dice(null, this.random);
    this.roll = input => dice.roll(input).total;
  }
}
