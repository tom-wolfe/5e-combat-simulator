import * as Actions from '@sim/simulation/actions';
import { Creature } from '@sim/simulation/creature';

const creature = new Creature({
  name: '', type: 'monster', ac: 14, actions: [
    { name: '', method: 'attack', mod: 10, damages: [], uses: 0 },
    { name: '', method: 'attack', mod: 10, damages: [] },
    { name: '', method: 'attack', mod: 10, damages: [], uses: 2 }
  ], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2,
  saves: null
});

describe('action', () => {
  describe('possibleActions', () => {
    it('returns actions with uses remaining.', () => {
      const result = Actions.possibleActions(creature, false);
      expect(result).toEqual([creature.actions[1], creature.actions[2]]);
    });
  });
  describe('first', () => {
    it('returns first action with uses remaining.', () => {
      const result = Actions.first(creature.actions, null);
      expect(result).toEqual(creature.actions[0]);
    });
  });
});
