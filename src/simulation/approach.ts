import { EncounterStrategy } from '@sim/models';
import { Approach, ApproachStrategy } from '@sim/models/strategy';
import { Creature } from './creature';

export const offensive: ApproachStrategy = (current: Creature, strategy: EncounterStrategy): Approach => {
  return 'offensive';
}

// TODO: Defensive if unconscious.
// TODO: Smart - heal if close to unconscious.
