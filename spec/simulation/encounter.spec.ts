// import { Action, Encounter } from '@sim/models';
// import { Creature } from '@sim/models/creature';
// import * as Target from '@sim/simulation/target';

// import * as Dice from './utils/dice';

// describe('encounter', () => {
//   describe('begin', () => {
//     it('should roll initiative and reset HP.', () => {
//       const creatures: Creature[] = [
//         { name: '', type: 'player', ac: 14, actions: [], maxHp: 10, initiativeMod: 2 },
//       ];
//       const encounter = new Encounter(new Dice.ConstantProvider(5));
//       const output = encounter.begin(creatures);
//       expect(output[0].initiative).toEqual(7);
//       expect(output[0].hp).toEqual(10);
//     });
//   });
//   describe('turnOrder', () => {
//     it('should return creatures in descending order of initiative.', () => {
//       const creatures: Creature[] = [
//         { name: '', type: 'player', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 15, initiativeMod: 2 },
//         { name: '', type: 'player', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2 },
//         { name: '', type: 'player', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 10, initiativeMod: 2 },
//       ];
//       const encounter = new Encounter(new Dice.ConstantProvider(5));
//       const output = encounter.turnOrder(creatures);
//       expect(output[0].initiative).toEqual(20);
//       expect(output[1].initiative).toEqual(15);
//       expect(output[2].initiative).toEqual(10);
//     });
//   });
//   describe('target', () => {
//     it('should return first opposing creature.', () => {
//       const creatures: Creature[] = [
//         { name: '', type: 'player', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 10, initiativeMod: 2 },
//         { name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 15, initiativeMod: 2 },
//         { name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2 },
//       ];
//       const encounter = new Encounter(new Dice.ConstantProvider(5));
//       encounter.targetStrategy = Target.first;
//       const output = encounter.target(creatures[0], creatures);
//       expect(output).toBe(creatures[1]);
//     });
//     it('should ignore unconscious targets.', () => {
//       const creatures: Creature[] = [
//         { name: '', type: 'player', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 10, initiativeMod: 2 },
//         { name: '', type: 'monster', ac: 14, actions: [], hp: 0, maxHp: 10, initiative: 15, initiativeMod: 2 },
//         { name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2 },
//       ];
//       const encounter = new Encounter(new Dice.ConstantProtargetStrategy = Target.first;
//       const output = encounter.target(creatures[0], creatures);
//       expect(output).toBe(creatures[2]);
//     });
//   });
//   describe('dealDamage', () => {
//     it('should reduce HP by the damage dealt.', () => {
//       const target: Creature = {
//         name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2
//       };

//       const encounter = new Encounter();
//       encounter.dealDamage(target, 4);
//       expect(target.hp).toBe(6);
//     });
//   });
//   describe('winner', () => {
//     it('should return undefined if there are no winners.', () => {
//       const creatures: Creature[] = [
//         { name: '', type: 'player', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 10, initiativeMod: 2 },
//         { name: '', type: 'monster', ac: 14, actions: [], hp: 0, maxHp: 10, initiative: 15, initiativeMod: 2 },
//         { name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2 },
//       ];

//       const encounter = new Encounter();
//       const winner = encounter.winner(creatures);
//       expect(winner).toBeFalsy();
//     });
//     it('should return the correct winner.', () => {
//       const creatures: Creature[] = [
//         { name: '', type: 'player', ac: 14, actions: [], hp: 0, maxHp: 10, initiative: 10, initiativeMod: 2 },
//         { name: '', type: 'monster', ac: 14, actions: [], hp: 0, maxHp: 10, initiative: 15, initiativeMod: 2 },
//         { name: '', type: 'monster', ac: 14, actions: [], hp: 10, maxHp: 10, initiative: 20, initiativeMod: 2 },
//       ];

//       const encounter = new Encounter();
//       const winner = encounter.winner(creatures);
//       expect(winner).toEqual('monster');
//     });
//   });
// });
