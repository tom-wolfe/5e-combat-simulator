import { RandomProvider } from 'dice-typescript';

import { CreatureType } from './creature';
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

export interface EncounterResult {
  winner: CreatureType;
  survivors: string[];
  rounds: number;
}
