import { Action, Creature } from '@sim/models';

export function possibleActions(creature: Creature): Action[] {
    // TODO: Filter by resources (usage and spell slots).
  return creature.actions;
}
