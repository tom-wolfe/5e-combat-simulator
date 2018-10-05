import { Action, Damage } from '@sim/models';
import { Creature } from '@sim/models/creature';
import * as Attack from '@sim/simulation/attack';

describe('attack', () => {
  const attack: Action = { name: '', method: 'attack', mod: 5, damages: [{ dice: '1d6', mod: 0, type: 'slashing' }] };
  const save: Action = { name: '', method: 'save', mod: 16, damages: [{ dice: '1d6', mod: 0, type: 'slashing' }], halfOnSuccess: false };
  const saveHalf: Action = { name: '', method: 'save', mod: 16, damages: [{ dice: '1d6', mod: 0, type: 'slashing' }], halfOnSuccess: true };
  const target: Creature = {
    name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2
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
    it('should miss if they rolled AC or above.', () => {
      const result = Attack.savingThrow(save, target, roll(16));
      expect(result).toEqual('miss');
    });
    it('should miss if they rolled a 20.', () => {
      const result = Attack.savingThrow(save, target, roll(20));
      expect(result).toEqual('miss');
    });
    // TODO: Add saving throw modifiers.
    // it('should factor saving throw bonus.', () => {
    //   const result = Attack.savingThrow(save, target, roll(11));
    //   expect(result).toEqual('miss');
    // });
  });
  describe('calculateDamage', () => {
    it('returns 0 on missed attack.', () => {
      const result = Attack.calculateDamage(attack, 'miss', roll(5), roll(10));
      expect(result.length).toEqual(0);
    });
    it('rolls half damage on missed save.', () => {
      const result = Attack.calculateDamage(saveHalf, 'miss', roll(6), roll(10));
      expect(result.length).toEqual(1);
      expect(result[0].amount).toEqual(3);
    });
  });
  describe('attackDamage', () => {
    it('should return nothing if they miss.', () => {
      const result = Attack.attackDamage(attack, 'miss', roll(5), roll(10));
      expect(result.length).toEqual(0);
    });
    it('should roll regular damage if they hit.', () => {
      const result = Attack.attackDamage(attack, 'hit', roll(5), roll(10));
      expect(result.length).toEqual(1);
      expect(result[0].amount).toEqual(5);
    });
    it('should roll double damage if they crit.', () => {
      const result = Attack.attackDamage(attack, 'crit', roll(5), roll(10));
      expect(result.length).toEqual(1);
      expect(result[0].amount).toEqual(10);
    });
  });
  describe('saveDamage', () => {
    it('should return nothing if they save and it\'s not half on save.', () => {
      const result = Attack.saveDamage(save, 'miss', roll(5));
      expect(result.length).toEqual(0);
    });
    it('should roll half damage if they save and it\'s half on save..', () => {
      const result = Attack.saveDamage(saveHalf, 'miss', roll(6));
      expect(result.length).toEqual(1);
      expect(result[0].amount).toEqual(3);
    });
    it('should roll normal damage on hit.', () => {
      const result = Attack.saveDamage(saveHalf, 'hit', roll(6));
      expect(result.length).toEqual(1);
      expect(result[0].amount).toEqual(6);
    });
    it('should roll normal damage on crit.', () => {
      const result = Attack.saveDamage(saveHalf, 'crit', roll(6));
      expect(result.length).toEqual(1);
      expect(result[0].amount).toEqual(6);
    });
  });
  describe('totalDamage', () => {
    it('should return zero for empty damage.', () => {
      const result = Attack.totalDamage([]);
      expect(result).toBe(0);
    });
    it('should sum all damages.', () => {
      const damage: Damage[] = [
        { amount: 10, magical: false, type: 'bludgeoning' },
        { amount: 10, magical: true, type: 'slashing' }
      ]
      const result = Attack.totalDamage(damage);
      expect(result).toEqual(20);
    });
  });
});
