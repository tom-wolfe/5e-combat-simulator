import { Creature, Encounter } from '@sim/models';
import { Approach, ApproachStrategy } from '@sim/models/strategy';

export const offensive: ApproachStrategy = (current: Creature, encounter: Encounter): Approach => {
  return 'offensive';
}

// TODO: Defensive if unconscious.
// TODO: Smart - heal if close to unconscious.
