import { Creature, Encounter } from '@sim/models';
import { Simulator } from '@sim/simulation/simulator';
import * as _ from 'lodash';

const templateEncounter: Encounter = {
  creatures: [
    { name: '1', type: 'player', ac: 10, actions: [], initiativeMod: 0, maxHp: 10 },
    { name: '2', type: 'player', ac: 10, actions: [], initiativeMod: 1, maxHp: 10 },
    { name: '3', type: 'player', ac: 10, actions: [], initiativeMod: 2, maxHp: 10 },
    { name: '4', type: 'player', ac: 10, actions: [], initiativeMod: 3, maxHp: 10 }
  ]
};

describe('simulator', () => {
  describe('begin', () => {
    it('should roll initiative and reset HP.', () => {
      const simulator = new Simulator();
      const encounter = _.cloneDeep(templateEncounter);
      encounter.roll = _n => 5;
      simulator.begin(encounter);

      expect(encounter.creatures[0].initiative).toEqual(5);
      expect(encounter.creatures[1].initiative).toEqual(6);
      expect(encounter.creatures[2].initiative).toEqual(7);
      expect(encounter.creatures[3].initiative).toEqual(8);
    });
  });
  describe('turnOrder', () => {
    it('should return creatures in descending order of initiative.', () => {
      const simulator = new Simulator();
      const encounter = _.cloneDeep(templateEncounter);
      encounter.roll = _n => 5;
      simulator.begin(encounter);
      const creatures = simulator.turnOrder(encounter.creatures);
      expect(creatures[0].initiative).toEqual(8);
      expect(creatures[1].initiative).toEqual(7);
      expect(creatures[2].initiative).toEqual(6);
      expect(creatures[3].initiative).toEqual(5);
    });
  });
  describe('dealDamage', () => {
    it('should reduce HP by the damage dealt.', () => {
      const target: Creature = {
        name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2
      };
      const simulator = new Simulator();
      simulator.dealDamage(target, [{ amount: 4, type: 'fire' }]);
      expect(target.hp).toBe(6);
    });
  });
  describe('winner', () => {
    it('should return undefined if there are no winners.', () => {
      const test: Encounter = {
        creatures: [
          { name: '', type: 'player', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 10, initiativeMod: 2 },
          { name: '', type: 'monster', ac: 14, actions: [], hp: 0, maxHp: 10, initiative: 15, initiativeMod: 2 },
          { name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2 },
        ]
      };
      const simulator = new Simulator();
      const winner = simulator.winner(test);
      expect(winner).toBeFalsy();
    });
    it('should return the correct winner.', () => {
      const test: Encounter = {
        creatures: [
          { name: '', type: 'player', ac: 14, actions: [], hp: 0, maxHp: 10, initiative: 10, initiativeMod: 2 },
          { name: '', type: 'monster', ac: 14, actions: [], hp: 0, maxHp: 10, initiative: 15, initiativeMod: 2 },
          { name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2 },
        ]
      };
      const simulator = new Simulator();
      const winner = simulator.winner(test);
      expect(winner).toEqual('monster');
    });
  });
});
