import { EncounterModel } from '@sim/models';
import * as Strategy from '@sim/simulation/strategy';

const encounter: EncounterModel = {
  creatures: [
    { name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'monster', saves: null },
    { name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player', saves: null },
    { name: '', ac: 10, hp: 8, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player', saves: null },
    { name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player', saves: null }
  ]
}

describe('strategy', () => {
  describe('first', () => {
    it('should take the first target.', () => {
      const creature = encounter.creatures[1];
      const ta = Strategy.first(creature, creature.actions, encounter.creatures, null);
      expect(ta.targets.length).toBe(1);
      expect(ta.targets[0]).toBe(encounter.creatures[0]);
      expect(ta.action).toBe(creature.actions[0]);
    })
  });
});
