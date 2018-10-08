import { Creature, DefensiveStrategy, Encounter, OffensiveStrategy, TargettedAction } from '@sim/models';

import * as Actions from './actions';
import * as Targets from './targets';

export const first: DefensiveStrategy = (current: Creature, encounter: Encounter): TargettedAction => {
  const actions = Actions.possibleActions(current);
  const targets = Targets.allied(current, encounter);
  return {
    action: Actions.first(actions, encounter),
    targets: Targets.first(targets, encounter)
  };
}

export const random: OffensiveStrategy = (current: Creature, encounter: Encounter): TargettedAction => {
  const actions = Actions.possibleActions(current);
  const targets = Targets.allied(current, encounter);
  return {
    action: Actions.random(actions, encounter),
    targets: Targets.random(targets, encounter, 1)
  };
}

// TODO: Heal the most useful party member.
// TODO: Heal unconscious
// TODO: Smart: If there are two party members down, heal the one that has healing. Otherwise, heal the strongest.
