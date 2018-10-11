import { CreatureModel, EncounterModel } from '@sim/models';
import { Approach, ApproachStrategy } from '@sim/models/strategy';

export const offensive: ApproachStrategy = (current: CreatureModel, encounter: EncounterModel): Approach => {
  return 'offensive';
}

// TODO: Defensive if unconscious.
// TODO: Smart - heal if close to unconscious.
