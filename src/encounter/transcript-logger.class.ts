import { Action, Hit } from '@sim/action';
import { Creature } from '@sim/creature';
import * as _ from 'lodash';
import { EncounterTranscript } from './encounter-transcript.interface';

export class TranscriptLogger {
  private round = 0;
  private _transcript: EncounterTranscript = {};

  getTranscript(): EncounterTranscript {
    return _.clone(this._transcript);
  }

  nextRound() { this.round++; }

  legendary(creature: Creature) {
    this.log(`${creature.name} is taking a legendary action!`);
  }

  attack(creature: Creature, hit: Hit, target: Creature, action: Action) {
    switch (hit) {
      case 'hit': this.log(`${creature.name} hit ${target.name} with ${action.name}!`); break;
      case 'crit': this.log(`${creature.name} crit with ${action.name} against ${target.name}!`); break;
      case 'miss': this.log(`${creature.name} missed ${target.name} with ${action.name}!`); break;
    }
  }

  save(creature: Creature, target: Creature, action: Action) {
    this.log(`${creature.name} used ${action.name} on ${target.name}.`);
  }

  makeSave(creature: Creature, hit: Hit, legendary: boolean) {
    if (legendary) {
      this.log(`${creature.name} failed the saving throw, but chose to succeed!`);
    } else {
      if (hit === 'hit') {
        this.log(`${creature.name} failed the saving throw!`);
      } else {
        this.log(`${creature.name} succeeded on the saving throw!`);
      }
    }

  }

  takeDamage(creature: Creature, damage: number) {
    if (damage > 0) {
      this.log(`${creature.name} took ${damage} points of damage! ${creature.hp}hp remaining.`);
    }
  }

  regenerate(creature: Creature, amount: number) {
    this.log(`${creature.name} regenerated ${amount}hp. ${creature.hp}hp remaining.`);
  }

  winner(winner: string) {
    this.log(`The winner was: ${winner}`);
  }

  private log(message: string) {
    const array = (this._transcript[this.round] = this._transcript[this.round] || []);
    array.push(message);
  }
}
