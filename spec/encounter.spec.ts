import { Encounter } from '../src/encounter';
import { Creature, EncounterCreature } from '../src/models/creature';
import * as Dice from './utils/dice';

describe('encounter', () => {
  describe('begin', () => {
    it('should roll initiative and reset HP.', () => {
      const creatures: Creature[] = [
        { name: '', type: 'player', ac: 14, toHit: 6, damage: '', maxHp: 10, initiativeBonus: 2 },
      ];
      const encounter = new Encounter(Dice.constant(5));
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
      const encounter = new Encounter(Dice.constant(5));
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
      const encounter = new Encounter(Dice.constant(5));
      const output = encounter.target(creatures[0], creatures);
      expect(output).toBe(creatures[1]);
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

      const encounter = new Encounter(Dice.sequential(5));
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

      const encounter = new Encounter(Dice.sequential(14, 2));
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

      const encounter = new Encounter(Dice.sequential(11, 2));
      const result = encounter.toHit(creature, target);
      expect(result).toBeTruthy();
    });
  });
  describe('damage', () => {
    it('should reduce HP by the amount damaged.', () => {
      const creature: EncounterCreature = {
        name: '', type: 'player', ac: 14, toHit: 0, damage: '', hp: 10, maxHp: 10, initiative: 10, initiativeBonus: 2
      };
      const target: EncounterCreature = {
        name: '', type: 'monster', ac: 14, toHit: 0, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2
      };

      const encounter = new Encounter(Dice.sequential(4));
      encounter.damage(creature, target);
      expect(target.hp).toBe(6);
    });
  });
  describe('checkUnconscious', () => {
    it('should remove any unconscious creatures.', () => {
      const creatures: EncounterCreature[] = [
        { name: '', type: 'player', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 10, initiativeBonus: 2 },
        { name: '', type: 'monster', ac: 14, toHit: 6, damage: '', hp: 0, maxHp: 10, initiative: 15, initiativeBonus: 2 },
        { name: '', type: 'monster', ac: 14, toHit: 6, damage: '', hp: 10, maxHp: 10, initiative: 20, initiativeBonus: 2 },
      ];

      const encounter = new Encounter(Dice.sequential(4));
      encounter.checkUnconscious(creatures);
      expect(creatures.length).toBe(2);
    });
  });
});
