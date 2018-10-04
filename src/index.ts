import { Creature } from './models/creature';
import { Simulator } from './simulator';

const creatures: Creature[] = [
  { name: 'D\'artagnan', type: 'player', ac: 16, toHit: 8, damage: d => d('2d8') + 4, maxHp: 26, initiativeBonus: -1 },
  { name: 'Sebastian', type: 'player', ac: 14, toHit: 6, damage: d => d('2d6') + 4, maxHp: 21, initiativeBonus: 2 },
  { name: 'Patricia', type: 'player', ac: 14, toHit: 6, damage: d => d('2d6') + 4, maxHp: 21, initiativeBonus: 2 },
  { name: 'Neferi', type: 'player', ac: 15, toHit: 6, damage: d => d('3d6') + 3, maxHp: 21, initiativeBonus: 5 },
  { name: 'Vennris', type: 'player', ac: 14, toHit: 6, damage: d => d('2d6') + 4, maxHp: 21, initiativeBonus: 2 },

  { name: '???', type: 'monster', ac: 16, toHit: 8, damage: d => d('1d8') + d('8d6') + 8, maxHp: 144, initiativeBonus: 4 },
];

const simulator = new Simulator();

const battles = 1000;
const result = simulator.simulate(creatures, 1000);

const success = result.wins.player / battles * 100;
console.log(`Players have a ${success.toFixed(2)}% chance of success.`);
Object.keys(result.survivors).forEach(s => {
  const n = result.survivors[s] / battles * 100;
  console.log(`${s} has a ${n.toFixed(2)}% chance of surviving.`);
})
