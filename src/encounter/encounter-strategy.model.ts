import { RandomProvider } from 'dice-typescript';
import { RollDice } from '@sim/random';
import { ActionStrategy, ApproachStrategy, DiceStrategy } from '@sim/strategy';

export interface EncounterStrategy {
  random: RandomProvider;
  roll: RollDice;
  approach: ApproachStrategy;
  offensive: ActionStrategy;
  defensive: ActionStrategy;
  critical: DiceStrategy;
}
