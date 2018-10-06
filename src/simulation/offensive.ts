import { Creature, Encounter, OffensiveStrategy, TargettedAction } from '@sim/models';
import * as Actions from './actions';
import { opposing } from './targets';

export const first: OffensiveStrategy = (current: Creature, encounter: Encounter): TargettedAction => {
  const actions = Actions.possibleActions(current);
  const targets = opposing(current, encounter).filter(c => c.hp > 0);
  return {
    action: actions[0],
    targets: targets.slice(0, 1)
  };
}

export const random: OffensiveStrategy = (current: Creature, encounter: Encounter): TargettedAction => {
  const actions = Actions.possibleActions(current);
  const targets = opposing(current, encounter).filter(c => c.hp > 0);
  return {
    action: actions[encounter.random.numberBetween(0, actions.length - 1)],
    targets: [targets[encounter.random.numberBetween(0, targets.length - 1)]].filter(t => t)
  };
}

// TODO: Reduce code duplication with the filter and the random selection

// TODO: Do the most damage
// TODO: Target the weakest creature.
// TODO: Do the most damage to the strongest creature.
// TODO: Kill off the strongest weak creature with a single hit, or do the most damage.
