import { RandomProvider } from 'dice-typescript';

import { CreatureModel, CreatureType } from './creature';
import { RollDice } from './dice';
import { ActionStrategy, ApproachStrategy, DiceStrategy } from './strategy';

export interface EncounterModel {
  random?: RandomProvider;
  roll?: RollDice;
  approach?: ApproachStrategy;
  offensive?: ActionStrategy;
  defensive?: ActionStrategy;
  critical?: DiceStrategy;
  creatures: CreatureModel[];
}

export interface EncounterResult {
  winner: CreatureType;
  survivors: string[];
  rounds: number;
}
