import { Creature } from '@sim/simulation/creature';
import * as Strategy from '@sim/simulation/strategy';

const creatures: Creature[] = [
  new Creature({ name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'monster', saves: null }),
  new Creature({ name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player', saves: null }),
  new Creature({ name: '', ac: 10, hp: 8, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player', saves: null }),
  new Creature({ name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player', saves: null })
];

describe('strategy', () => {
  describe('first', () => {
    it('should take the first target.', () => {
      const creature = creatures[1];
      const ta = Strategy.first(creature, creature.actions, creatures, null);
      expect(ta.targets.length).toBe(1);
      expect(ta.targets[0]).toBe(creatures[0]);
      expect(ta.action).toBe(creature.actions[0]);
    })
  });
});
