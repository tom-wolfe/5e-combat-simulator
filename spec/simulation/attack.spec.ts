import { Action } from '@sim/models';
import { Creature } from '@sim/models/creature';
import * as Attack from '@sim/simulation/attack';

describe('attack', () => {
  describe('toHit', () => {
    it('should miss if they rolled under AC.', () => {
      const action: Action = { name: '', method: 'attack', mod: 0, damages: [{ dice: '', mod: 0, type: 'slashing' }] };
      const target: Creature = {
        name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2
      };
      const roll = _ => 5;
      const result = Attack.toHit(action, target, roll);
      expect(result).toEqual('miss');
    });
    it('should hit if they rolled AC or above.', () => {
      const action: Action = { name: '', method: 'attack', mod: 0, damages: [{ dice: '', mod: 0, type: 'slashing' }] };
      const target: Creature = {
        name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2
      };
      const roll = _ => 14;
      const result = Attack.toHit(action, target, roll);
      expect(result).toEqual('hit');
    });
    it('should crit if they rolled a 20.', () => {
      const action: Action = { name: '', method: 'attack', mod: 0, damages: [{ dice: '', mod: 0, type: 'slashing' }] };
      const target: Creature = {
        name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2
      };
      const roll = _ => 20;
      const result = Attack.toHit(action, target, roll);
      expect(result).toEqual('crit');
    });
    it('should factor toHit bonus.', () => {
      const action: Action = { name: '', method: 'attack', mod: 5, damages: [{ dice: '', mod: 0, type: 'slashing' }] };
      const target: Creature = {
        name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2
      };
      const roll = _ => 11;
      const result = Attack.toHit(action, target, roll);
      expect(result).toEqual('hit');
    });
  });
  // TODO: savingThrow method.
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
