import { Encounter } from '@sim/models';
import * as Targets from '@sim/simulation/targets';

const encounter: Encounter = {
  creatures: [
    { name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'monster' },
    { name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player' },
    { name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'monster' },
    { name: '', ac: 10, hp: 8, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player' },
    { name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'monster' },
  ]
}

describe('offensive', () => {
  describe('allied', () => {
    it('should select targets with the same type (monster).', () => {
      const targets = Targets.allied(encounter.creatures[0], encounter);
      expect(targets).toEqual([encounter.creatures[0], encounter.creatures[2], encounter.creatures[4]]);
    })
    it('should select targets with the same type (player).', () => {
      const targets = Targets.allied(encounter.creatures[1], encounter);
      expect(targets).toEqual([encounter.creatures[1], encounter.creatures[3]]);
    })
  });
  describe('opposing', () => {
    it('should select targets with the opposite type (monster).', () => {
      const targets = Targets.opposing(encounter.creatures[0], encounter);
      expect(targets).toEqual([encounter.creatures[1], encounter.creatures[3]]);
    })
    it('should select targets with the opposite type (player).', () => {
      const targets = Targets.opposing(encounter.creatures[1], encounter);
      expect(targets).toEqual([encounter.creatures[0], encounter.creatures[2], encounter.creatures[4]]);
    })
  });
});
