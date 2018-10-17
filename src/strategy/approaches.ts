import { Creature } from '@sim/creature';
import { Encounter } from '@sim/encounter';
import { Approach } from './approach.type';
import { Targets } from './targets';

export const Approaches = {
  offensive(current: Creature, encounter: Encounter): Approach {
    return 'offensive';
  },
  smart(current: Creature, encounter: Encounter): Approach {
    if (Targets.allied(current, encounter.creatures).some(c => c.hp <= 0)) {
      if (current.availableActions(false).some(a => a.method === 'heal')) {
        return 'defensive';
      }
      return 'offensive';
    };
    return 'offensive';
  }
};
