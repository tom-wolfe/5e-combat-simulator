import { EncounterStrategy } from '@sim/encounter';
import { RollDice } from '@sim/random';
import { ActionStrategy, Approaches, ApproachStrategy, Criticals, DiceStrategy, Strategies } from '@sim/strategy';
import { DefaultRandomProvider, Dice, RandomProvider } from 'dice-typescript';

export class DefaultEncounterStrategy implements EncounterStrategy {
  constructor() {
    const dice = new Dice();
    this.roll = input => dice.roll(input).total;
  }
  random: RandomProvider = new DefaultRandomProvider();
  roll: RollDice;
  approach: ApproachStrategy = Approaches.offensive;
  offensive: ActionStrategy = Strategies.smartOffense;
  defensive: ActionStrategy = Strategies.random;
  critical: DiceStrategy = Criticals.rollTwice;
}
