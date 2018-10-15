import { Creature } from '@sim/creature';
import { EncounterStrategy } from '@sim/encounter';
import { ApproachStrategy } from './approach-strategy.type';
import { Approach } from './approach.type';

const offensive: ApproachStrategy = (current: Creature, strategy: EncounterStrategy): Approach => {
  return 'offensive';
}

// TODO: Defensive if unconscious.
// TODO: Smart - heal if close to unconscious.

export const Approaches = {
  offensive

};
