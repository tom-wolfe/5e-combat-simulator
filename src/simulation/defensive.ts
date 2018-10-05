import { Creature, DefensiveStrategy, Encounter, OffensiveStrategy, TargettedAction } from '@sim/models';

import { allied } from './targets';

export const first: DefensiveStrategy = (current: Creature, encounter: Encounter): TargettedAction => {
  const targets = allied(current, encounter);
  return {
    action: current.actions[0],
    targets: targets.slice(0, 1)
  };
}

export const random: OffensiveStrategy = (current: Creature, encounter: Encounter): TargettedAction => {
  const targets = allied(current, encounter);
  return {
    action: current.actions[encounter.random.numberBetween(0, current.actions.length - 1)],
    targets: [targets[encounter.random.numberBetween(0, targets.length - 1)]].filter(t => t)
  };
}

// TODO: Heal the most useful party member.
// TODO: Heal unconscious
// TODO: Smart: If there are two party members down, heal the one that has healing. Otherwise, heal the strongest.
