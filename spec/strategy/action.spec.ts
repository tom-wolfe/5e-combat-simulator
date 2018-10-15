import { Actions } from '@sim/strategy';
import { Creature } from '@sim/creature';

const creature = new Creature(null, {
  name: '', type: 'monster', ac: 14, actions: [
    { name: '', method: 'attack', mod: 10, damages: [], uses: 0 },
    { name: '', method: 'attack', mod: 10, damages: [] },
    { name: '', method: 'attack', mod: 10, damages: [], uses: 2 }
  ], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2,
  saves: null
});

describe('action', () => {
  describe('first', () => {
    it('returns first action with uses remaining.', () => {
      const result = Actions.first(creature.actions, null);
      expect(result).toEqual(creature.actions[0]);
    });
  });
});
