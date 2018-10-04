import * as _ from 'lodash';

import { DiceFunction } from './dice';

const LOG = false;

export class Encounter {

  constructor(private dice: DiceFunction) { }

  initiative(creatures) {
    let rolled = creatures.map(c => ({ ...c, initiative: this.dice('1d20') + c.initiativeBonus }));
    rolled = _.orderBy(rolled, c => c.initiative, 'desc');
    if (LOG) { console.log('Initiative: ', rolled.map(c => `${c.initiative}: ${c.name}`).join(', ')); }
    return rolled;
  }

  round(creatures) {
    const players = creatures.filter(c => c.type === 'player');
    const monsters = creatures.filter(c => c.type === 'monster');
    _.orderBy(creatures, c => c.initiative, 'desc').forEach(c => {
      if (c.hp > 0) {
        this.turn(c, c.type === 'monster' ? players : monsters);
      }
    });
    return [...players, ...monsters];
  }

  turn(creature, targets) {
    const target = targets[0];
    if (!target) {
      if (LOG) { console.log(`There are no opponents for ${creature.name} to target.`) }
      return;
    }

    const toHit = this.dice('1d20') + creature.toHit;
    if (toHit < target.ac) {
      // Miss!
      return;
    }

    const damage = creature.damage(this.dice);
    target.hp -= damage;

    let message = `${creature.type} ${creature.name} hits ${target.name} for ${damage} points of damage. `

    if (target.hp <= 0) {
      targets.splice(0, 1);
      message += `${target.name} was defeated!`;
    } else {
      message += `${target.hp}hp remaining.`;
    }
    if (LOG) { console.log(message); }
  }

  winner(creatures) {
    if (creatures.filter(c => c.type === 'player').length === 0) { return 'monsters'; }
    if (creatures.filter(c => c.type === 'monster').length === 0) { return 'players'; }
    return undefined;
  }

  run(creatures) {
    let w, curRound = this.initiative(creatures);
    while (!(w = this.winner(curRound))) {
      curRound = this.round(curRound);
    }
    return {
      winner: w,
      survivors: curRound.map(c => c.name)
    };
  }
}
