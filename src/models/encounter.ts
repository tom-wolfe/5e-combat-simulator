import { RandomProvider } from 'dice-typescript';

import { RollDice } from './dice';
import { ActionStrategy, ApproachStrategy, DiceStrategy } from './strategy';

export interface EncounterStrategy {
  random: RandomProvider;
  roll: RollDice;
  approach: ApproachStrategy;
  offensive: ActionStrategy;
  defensive: ActionStrategy;
  critical: DiceStrategy;
}
