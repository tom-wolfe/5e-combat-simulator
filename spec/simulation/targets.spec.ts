import * as Targets from '@sim/simulation/targets';
import { Creature } from '@sim/simulation/creature';

const creatures = [
  new Creature({ name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'monster', saves: null }),
  new Creature({ name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player', saves: null }),
  new Creature({ name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'monster', saves: null }),
  new Creature({ name: '', ac: 10, hp: 8, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'player', saves: null }),
  new Creature({ name: '', ac: 10, hp: 10, maxHp: 20, actions: [], initiative: 10, initiativeMod: 0, type: 'monster', saves: null }),
];

describe('offensive', () => {
  describe('allied', () => {
    it('should select targets with the same type (monster).', () => {
      const targets = Targets.allied(creatures[0], creatures);
      expect(targets).toEqual([creatures[0], creatures[2], creatures[4]]);
    })
    it('should select targets with the same type (player).', () => {
      const targets = Targets.allied(creatures[1], creatures);
      expect(targets).toEqual([creatures[1], creatures[3]]);
    })
  });
  describe('opposing', () => {
    it('should select targets with the opposite type (monster).', () => {
      const targets = Targets.opposing(creatures[0], creatures);
      expect(targets).toEqual([creatures[1], creatures[3]]);
    })
    it('should select targets with the opposite type (player).', () => {
      const targets = Targets.opposing(creatures[1], creatures);
      expect(targets).toEqual([creatures[0], creatures[2], creatures[4]]);
    })
  });
});
