import { Action, Creature } from '@sim/models';

export function possibleActions(creature: Creature): Action[] {
    // TODO: Filter by spell slots.
  return creature.actions.filter(c => c.uses === undefined || c.uses > 0);
}
