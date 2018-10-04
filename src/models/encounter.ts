import { CreatureType } from './creature';

export interface EncounterResult {
  winner: CreatureType;
  survivors: string[];
}
