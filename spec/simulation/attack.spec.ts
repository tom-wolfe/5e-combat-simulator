import { Action, Damage } from '@sim/models';
import { CreatureModel } from '@sim/models/creature';
import * as Attack from '@sim/simulation/attack';

describe('attack', () => {
  const attack: Action = { name: '', method: 'attack', mod: 5, damages: [{ dice: '1d6', mod: 0, type: 'slashing' }] };
  const save: Action = {
    name: '', method: 'save', save: 'wis', mod: 16, damages: [{ dice: '1d6', mod: 0, type: 'slashing' }], halfOnSuccess: false
  };
  const saveHalf: Action = {
    name: '', method: 'save', save: 'wis', mod: 16, damages: [{ dice: '1d6', mod: 0, type: 'fire' }], halfOnSuccess: true
  };
  const target: CreatureModel = {
    name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2,
    alterations: [
      { alteration: 'immune', type: 'cold' },
      { alteration: 'resistant', type: 'lightning' },
      { alteration: 'vulnerable', type: 'psychic' },
      { alteration: 'resistant', type: 'piercing', mundaneOnly: true }
    ],
    saves: { str: 0, dex: 0, con: 0, int: 0, wis: 2, cha: 0 }
  };
  const roll = n => _ => n;

  describe('doesHit', () => {
    it('rolls to hit on an attack.', () => {
      const result = Attack.doesHit(attack, target, roll(5));
      expect(result).toEqual('miss');
    });
    it('rolls to save on a save.', () => {
      const result = Attack.doesHit(save, target, roll(5));
      expect(result).toEqual('hit');
    });
  });
  describe('toHit', () => {
    it('should miss if they rolled under AC.', () => {
      const result = Attack.toHit(attack, target, roll(5));
      expect(result).toEqual('miss');
    });
    it('should hit if they rolled AC or above.', () => {
      const result = Attack.toHit(attack, target, roll(14));
      expect(result).toEqual('hit');
    });
    it('should crit if they rolled a 20.', () => {
      const result = Attack.toHit(attack, target, roll(20));
      expect(result).toEqual('crit');
    });
    it('should factor toHit bonus.', () => {
      const result = Attack.toHit(attack, target, roll(11));
      expect(result).toEqual('hit');
    });
  });
  describe('savingThrow', () => {
    it('should hit if they rolled under DC.', () => {
      const result = Attack.savingThrow(save, target, roll(5));
      expect(result).toEqual('hit');
    });
    it('should miss if they rolled DC or above.', () => {
      const result = Attack.savingThrow(save, target, roll(16));
      expect(result).toEqual('miss');
    });
    it('should miss if they rolled a 20.', () => {
      const result = Attack.savingThrow(save, target, roll(20));
      expect(result).toEqual('miss');
    });
    it('should factor saving throw bonus.', () => {
      const result = Attack.savingThrow(save, target, roll(14));
      expect(result).toEqual('miss');
    });
    it('should throw if there is a missing ability.', () => {
      const test: Action = { name: '', method: 'save', mod: 16, damages: [], halfOnSuccess: false };
      expect(() => Attack.savingThrow(test, target, roll(1))).toThrow();
    });
  });
  describe('totalDamage', () => {
    it('should return zero for empty damage.', () => {
      const result = Attack.totalDamage([], target);
      expect(result).toBe(0);
    });
    it('should sum all damages.', () => {
      const damage: Damage[] = [
        { amount: 10, magical: false, type: 'bludgeoning' },
        { amount: 10, magical: true, type: 'slashing' }
      ];
      const result = Attack.totalDamage(damage, target);
      expect(result).toEqual(20);
    });
    it('does not count immunities.', () => {
      const damage: Damage[] = [
        { amount: 10, type: 'bludgeoning' },
        { amount: 10, type: 'cold' }
      ]
      const result = Attack.totalDamage(damage, target);
      expect(result).toEqual(10);
    });
    it('halves damage resistances.', () => {
      const damage: Damage[] = [
        { amount: 10, type: 'bludgeoning' },
        { amount: 10, type: 'lightning' }
      ];
      const result = Attack.totalDamage(damage, target);
      expect(result).toEqual(15);
    });
    it('does not count non-magical resistances.', () => {
      const damage: Damage[] = [
        { amount: 10, type: 'bludgeoning', },
        { amount: 10, type: 'piercing', magical: true }
      ];
      const result = Attack.totalDamage(damage, target);
      expect(result).toEqual(20);

      const damage2: Damage[] = [
        { amount: 10, type: 'bludgeoning', },
        { amount: 10, type: 'piercing', magical: false }
      ];
      const result2 = Attack.totalDamage(damage2, target);
      expect(result2).toEqual(15);
    });
    it('doubles damage vulnerabilities.', () => {
      const damage: Damage[] = [
        { amount: 10, type: 'bludgeoning' },
        { amount: 10, type: 'psychic' }
      ]
      const result = Attack.totalDamage(damage, target);
      expect(result).toEqual(30);
    });
  });
});
