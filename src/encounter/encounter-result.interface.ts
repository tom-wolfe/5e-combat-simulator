import { CreatureType, Creature } from '@sim/creature';

export interface EncounterResult {
  winner: CreatureType;
  survivors: Creature[];
  rounds: number;
}
