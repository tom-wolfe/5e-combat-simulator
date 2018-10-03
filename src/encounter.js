const Random = require('./random');
const _ = require('lodash');

const LOG = false;

function initiative(creatures) {
  let rolled = creatures.map(c => ({ ...c, initiative: Random.dice('1d20') + c.initiativeBonus }));
  rolled = _.orderBy(rolled, c => c.initiative, 'desc');
  if (LOG) { console.log('Initiative: ', rolled.map(c => `${c.initiative}: ${c.name}`).join(', ')); }
  return rolled;
}

function round(creatures) {
  const players = creatures.filter(c => c.type === 'player');
  const monsters = creatures.filter(c => c.type === 'monster');
  _.orderBy(creatures, c => c.initiative, 'desc').forEach(c => {
    if (c.hp > 0) {
      turn(c, c.type === 'monster' ? players : monsters);
    }
  });
  return [...players, ...monsters];
}

function turn(creature, opponents) {
  const target = opponents[0];
  if (!target) {
    if (LOG) { console.log(`There are no opponents for ${creature.name} to target.`)}
    return;
  }

  const damage = creature.damage(Random.dice);
  target.hp -= damage;

  let message = `${creature.type} ${creature.name} hits ${target.name} for ${damage} points of damage. `

  if (target.hp <= 0) {
    opponents.splice(0, 1);
    message += `${target.name} was defeated!`;
  } else {
    message += `${target.hp}hp remaining.`;
  }
  if (LOG) { console.log(message); }
}

function winner(creatures) {
  if (creatures.filter(c => c.type === 'player').length === 0) { return 'monsters'; }
  if (creatures.filter(c => c.type === 'monster').length === 0) { return 'players'; }
  return undefined;
}

function run(creatures) {
  let curRound = initiative(creatures), w = undefined;
  while (!(w = winner(curRound))) {
    curRound = round(curRound);
  }
  return {
    winner: w,
    survivors: curRound.map(c => c.name)
  };
}

module.exports = {
  initiative,
  round,
  turn,
  run,
  winner
};