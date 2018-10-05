import { Creature, Encounter } from '@sim/models';
import { Simulator } from '@sim/simulation/simulator';

// const dartagnan: Creature = {
//   name: 'D\'artagnan',
//   type: 'player',
//   ac: 16,
//   maxHp: 26,
//   initiativeMod: -1,
//   actions: [
//     {
//       name: 'Lux Aeterna',
//       method: 'attack',
//       mod: 8,
//       damages: [
//         { dice: '1d8', mod: 6, type: 'slashing', magical: true },
//         { dice: '1d8', type: 'radiant', magical: true }
//       ]
//     }
//   ],
// };

// const sebastian: Creature = {
//   name: 'Sebastian',
//   type: 'player',
//   ac: 16,
//   maxHp: 26,
//   initiativeMod: -1,
//   actions: [
//     {
//       name: 'Fire Bolt',
//       method: 'attack',
//       mod: 6,
//       damages: [{ dice: '1d10', type: 'fire', magical: true }]
//     }
//   ],
// };

// const patricia: Creature = {
//   name: 'Patricia',
//   type: 'player',
//   ac: 16,
//   maxHp: 26,
//   initiativeMod: -1,
//   actions: [
//     {
//       name: 'Fire Bolt',
//       method: 'attack',
//       mod: 6,
//       damages: [{ dice: '1d10', type: 'fire', magical: true }]
//     }
//   ],
// };

// const neferi: Creature = {
//   name: 'Neferi',
//   type: 'player',
//   ac: 16,
//   maxHp: 26,
//   initiativeMod: -1,
//   actions: [
//     {
//       name: 'Fire Bolt',
//       method: 'attack',
//       mod: 6,
//       damages: [{ dice: '1d10', type: 'fire', magical: true }]
//     }
//   ],
// };

// const vennris: Creature = {
//   name: 'Vennris',
//   type: 'player',
//   ac: 16,
//   maxHp: 26,
//   initiativeMod: -1,
//   actions: [
//     {
//       name: 'Fire Bolt',
//       method: 'attack',
//       mod: 6,
//       damages: [{ dice: '1d10', type: 'fire', magical: true }]
//     }
//   ],
// };

// const monster: Creature = {
//   name: '???',
//   type: 'monster',
//   ac: 16,
//   maxHp: 102,
//   initiativeMod: 3,
//   actions: [
//     {
//       name: 'Unarmed Strike',
//       method: 'attack',
//       mod: 7,
//       damages: [{ dice: '1d8', mod: 4, type: 'bludgeoning' }]
//     }
//   ],
// };

// const battles = 1000;
// const encounter: Encounter = {
//   creatures: [dartagnan, sebastian, patricia, neferi, vennris, monster]
// };

// const simulator = new Simulator();
// const result = simulator.simulate(encounter, battles);

// const success = result.wins.player / battles * 100;
// let message = '\n';
// message += `Players have a ${success.toFixed(2)}% chance of success.`;
// Object.keys(result.survivors).forEach(s => {
//   const n = result.survivors[s] / battles * 100;
//   message += `\n${s} has a ${n.toFixed(2)}% chance of surviving.`;
// });
// console.log(message);
