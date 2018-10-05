import { Encounter } from '@sim/models';
import * as Defensive from '@sim/simulation/defensive';

const encounter: Encounter = {
  creatures: [
    { name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'monster' },
    { name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player' },
    { name: '', ac: 10, hp: 8, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player' },
    { name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player' }
  ]
}

describe('defensive', () => {
  describe('first', () => {
    it('should take the first allied target.', () => {
      const ta = Defensive.first(encounter.creatures[0], encounter);
      expect(ta.targets.length).toBe(1);
      expect(ta.targets[0]).toBe(encounter.creatures[0]);
    })
  });
});
