import { ActionStrategy, ApproachStrategy, DiceStrategy, EncounterStrategy, RollDice } from '@sim/models';
import { DefaultRandomProvider, Dice, RandomProvider } from 'dice-typescript';
import { offensive } from './approach';
import { rollTwice } from './critical';
import { random, smartOffense } from './strategy';

export class DefaultEncounterStrategy implements EncounterStrategy {
  constructor() {
    const dice = new Dice();
    this.roll = input => dice.roll(input).total;
  }
  random: RandomProvider = new DefaultRandomProvider();
  roll: RollDice;
  approach: ApproachStrategy = offensive;
  offensive: ActionStrategy = smartOffense;
  defensive: ActionStrategy = random;
  critical: DiceStrategy = rollTwice;
}
