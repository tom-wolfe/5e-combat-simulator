import { Creature, EncounterCreature } from '@sim/models/creature';
import { Encounter } from '@sim/simulation/encounter';

import * as Dice from './utils/dice';

describe('encounter', () => {
  describe('begin', () => {
    it('should roll initiative and reset HP.', () => {
      const creatures: Creature[] = [
        { name: '', type: 'player', ac: 14, toHit: 6, damage: '', maxHp: 10, initiativeBonus: 2 },
      ];
      const encounter = new Encounter(new Dice.ConstantProvider(5));
      const output = encounter.begin(creatures);
      expect(output[0].initiative).toEqual(7);
      expect(output[0].hp).toEqual(10);
    });
  });
  describe('turnOrder', () => {
    it('should return creatures in descending order of initiative.', () => {
      const creatures: EncounterCreature[] = [
        { name: '', type: 'player', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 15, initiativeBonus: 2 },
        { name: '', type: 'player', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2 },
        { name: '', type: 'player', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 10, initiativeBonus: 2 },
      ];
      const encounter = new Encounter(new Dice.ConstantProvider(5));
      const output = encounter.turnOrder(creatures);
      expect(output[0].initiative).toEqual(20);
      expect(output[1].initiative).toEqual(15);
      expect(output[2].initiative).toEqual(10);
    });
  });
  describe('target', () => {
    it('should return first opposing creature.', () => {
      const creatures: EncounterCreature[] = [
        { name: '', type: 'player', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 10, initiativeBonus: 2 },
        { name: '', type: 'monster', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 15, initiativeBonus: 2 },
        { name: '', type: 'monster', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2 },
      ];
      const encounter = new Encounter(new Dice.ConstantProvider(5));
      const output = encounter.target(creatures[0], creatures);
      expect(output).toBe(creatures[1]);
    });
    it('should ignore unconscious targets.', () => {
      const creatures: EncounterCreature[] = [
        { name: '', type: 'player', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 10, initiativeBonus: 2 },
        { name: '', type: 'monster', ac: 14, toHit: 6, damage: '', hp: 0, maxHp: 10, initiative: 15, initiativeBonus: 2 },
        { name: '', type: 'monster', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2 },
      ];
      const encounter = new Encounter(new Dice.ConstantProvider(5));
      const output = encounter.target(creatures[0], creatures);
      expect(output).toBe(creatures[2]);
    });
  });
  describe('toHit', () => {
    it('should miss if they rolled under AC.', () => {
      const creature: EncounterCreature = {
        name: '', type: 'player', ac: 14, toHit: 0, damage: '', hp: 10, maxHp: 10, initiative: 10, initiativeBonus: 2
      };
      const target: EncounterCreature = {
        name: '', type: 'monster', ac: 14, toHit: 0, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2
      };

      const encounter = new Encounter(new Dice.ConstantProvider(5));
      const result = encounter.toHit(creature, target);
      expect(result).toBeFalsy();
    });
    it('should hit if they rolled AC or above.', () => {
      const creature: EncounterCreature = {
        name: '', type: 'player', ac: 14, toHit: 0, damage: '', hp: 10, maxHp: 10, initiative: 10, initiativeBonus: 2
      };
      const target: EncounterCreature = {
        name: '', type: 'monster', ac: 14, toHit: 0, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2
      };

      const encounter = new Encounter(new Dice.SequentialProvider([14, 4]));
      const result = encounter.toHit(creature, target);
      expect(result).toBeTruthy();
    });
    it('should factor toHit bonus.', () => {
      const creature: EncounterCreature = {
        name: '', type: 'player', ac: 14, toHit: 5, damage: '', hp: 10, maxHp: 10, initiative: 10, initiativeBonus: 2
      };
      const target: EncounterCreature = {
        name: '', type: 'monster', ac: 14, toHit: 0, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2
      };

      const encounter = new Encounter(new Dice.SequentialProvider([11]));
      const result = encounter.toHit(creature, target);
      expect(result).toBeTruthy();
    });
  });
  describe('calculateDamage', () => {
    it('should roll the correct number of dice.', () => {
      const creature: EncounterCreature = {
        name: '', type: 'player', ac: 14, toHit: 0, damage: '2d6', hp: 10, maxHp: 10, initiative: 10, initiativeBonus: 2
      };
      const encounter = new Encounter(new Dice.ConstantProvider(4));
      const damage = encounter.calculateDamage(creature);
      expect(damage).toBe(8);
    });
  });
  describe('dealDamage', () => {
    it('should reduce HP by the damage dealt.', () => {
      const target: EncounterCreature = {
        name: '', type: 'monster', ac: 14, toHit: 0, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2
      };

      const encounter = new Encounter();
      encounter.dealDamage(target, 4);
      expect(target.hp).toBe(6);
    });
  });
  describe('winner', () => {
    it('should return undefined if there are no winners.', () => {
      const creatures: EncounterCreature[] = [
        { name: '', type: 'player', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 10, initiativeBonus: 2 },
        { name: '', type: 'monster', ac: 14, toHit: 6, damage: '', hp: 0, maxHp: 10, initiative: 15, initiativeBonus: 2 },
        { name: '', type: 'monster', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2 },
      ];

      const encounter = new Encounter();
      const winner = encounter.winner(creatures);
      expect(winner).toBeFalsy();
    });
    it('should return the correct winner.', () => {
      const creatures: EncounterCreature[] = [
        { name: '', type: 'player', ac: 14, toHit: 6, damage: '', hp: 0, maxHp: 10, initiative: 10, initiativeBonus: 2 },
        { name: '', type: 'monster', ac: 14, toHit: 6, damage: '', hp: 0, maxHp: 10, initiative: 15, initiativeBonus: 2 },
        { name: '', type: 'monster', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2 },
      ];

      const encounter = new Encounter();
      const winner = encounter.winner(creatures);
      expect(winner).toEqual('monster');
    });
  });
});
