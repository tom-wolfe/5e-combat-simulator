import { Creature, Encounter, OffensiveStrategy, TargettedAction } from '@sim/models';

import { opposing } from './targets';

export const first: OffensiveStrategy = (current: Creature, encounter: Encounter): TargettedAction => {
  const targets = opposing(current, encounter).filter(c => c.hp > 0);
  return {
    action: current.actions[0],
    targets: targets.slice(0, 1)
  };
}

export const random: OffensiveStrategy = (current: Creature, encounter: Encounter): TargettedAction => {
  const targets = opposing(current, encounter).filter(c => c.hp > 0);
  return {
    action: current.actions[encounter.random.numberBetween(0, current.actions.length - 1)],
    targets: [targets[encounter.random.numberBetween(0, targets.length - 1)]].filter(t => t)
  };
}

// TODO: Do the most damage
// TODO: Target the weakest creature.
// TODO: Do the most damage to the strongest creature.
// TODO: Kill off the strongest weak creature with a single hit, or do the most damage.
