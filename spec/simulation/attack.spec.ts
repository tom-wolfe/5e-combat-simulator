import { Action } from '@sim/models';
import { Creature } from '@sim/models/creature';
import * as Attack from '@sim/simulation/attack';

describe('attack', () => {
  const attack: Action = { name: '', method: 'attack', mod: 5, damages: [{ dice: '', mod: 0, type: 'slashing' }] };
  const save: Action = { name: '', method: 'save', mod: 16, damages: [{ dice: '', mod: 0, type: 'slashing' }] };
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

  // TODO: calculateDamage method.
  // TODO: attackDamage method.
  // TODO: saveDamage method.
  // TODO: rollAllDamage method.
  // TODO: rollDamage method.
  // TODO: normalDamage method.
  // TODO: totalDamage method.

  // TODO: Make these work again.
  // describe('calculateDamage', () => {
  //   it('should roll normal damage on a hit.', () => {
  //     const action: Action = {
  //       name: 'Greatsword', method: 'attack', mod: 0, damages: [{ dice: '2d6', mod: 0, type: 'slashing' }]
  //     };
  //     const roll = _ => 4;
  //     const crit = (_, _2) => 9999;
  //     const damage = Attack.calculateDamage(action, 'hit', roll, crit);

  //     expect(damage.length).toEqual(1);
  //     expect(damage[0].amount).toEqual(8);
  //     expect(damage[0].type).toEqual('slashing');
  //   });
  //   it('should not return damage on a miss.', () => {
  //     const action: Action = {
  //       name: 'Greatsword', method: 'attack', mod: 0, damages: [{ dice: '2d6', mod: 0, type: 'slashing' }]
  //     };
  //     const roll = _ => 4;
  //     const crit = (_, _2) => 9999;
  //     const damage = Attack.calculateDamage(action, 'miss', roll, crit);

  //     expect(damage.length).toEqual(0);
  //   });
  //   it('should call the critical strategy on a crit.', () => {
  //     const action: Action = {
  //       name: 'Greatsword', method: 'attack', mod: 0, damages: [{ dice: '2d6', mod: 0, type: 'slashing' }]
  //     };
  //     const roll = _ => 4;
  //     const crit = (_, _2) => 9999;
  //     const damage = Attack.calculateDamage(action, 'hit', roll, crit);

  //     expect(damage.length).toEqual(1);
  //     expect(damage[0].amount).toEqual(9999);
  //     expect(damage[0].type).toEqual('slashing');
  //   });
  // });
});
