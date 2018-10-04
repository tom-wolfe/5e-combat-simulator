import { Encounter } from './encounter';

import { roll } from './dice';

const creatures = [
  { name: 'D\'artagnan', type: 'player', ac: 16, toHit: 8, damage: d => d('2d8') + 4, hp: 26, initiativeBonus: -1 },

  { name: 'Sebastian', type: 'player', ac: 14, toHit: 6, damage: d => d('2d6') + 4, hp: 21, initiativeBonus: 2 },
  { name: 'Patricia', type: 'player', ac: 14, toHit: 6, damage: d => d('2d6') + 4, hp: 21, initiativeBonus: 2 },
  { name: 'Neferi', type: 'player', ac: 15, toHit: 6, damage: d => d('3d6') + 3, hp: 21, initiativeBonus: 5 },
  { name: 'Vennris', type: 'player', ac: 14, toHit: 6, damage: d => d('2d6') + 4, hp: 21, initiativeBonus: 2 },

  { name: '???', type: 'monster', ac: 16, toHit: 8, damage: d => d('1d8') + d('8d6') + 8, hp: 144, initiativeBonus: 4 },
];

const winners = {
  monsters: 0,
  players: 0,
  survivors: {}
}

const encounter = new Encounter(roll);
const battles = 1000;
for (let x = 0; x < battles; x++) {
  const result = encounter.run(creatures);
  winners[result.winner]++;
  result.survivors.forEach(s => {
    winners.survivors[s] = (winners.survivors[s] || 0) + 1;
  });
}

const success = winners.players / battles * 100;
console.log(`Players have a ${success.toFixed(2)}% chance of success.\n`);
Object.keys(winners.survivors).forEach(s => {
  const n = winners.survivors[s] / battles * 100;
  console.log(`${s} has a ${n.toFixed(2)}% chance of surviving.`);
})
