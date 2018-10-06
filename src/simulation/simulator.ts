import { Action, Creature, CreatureType, Damage, Encounter, EncounterResult } from '@sim/models';
import { SimulationResult } from '@sim/models/simulation';
import * as Approach from '@sim/simulation/approach';
import * as Critical from '@sim/simulation/critical';
import * as Defensive from '@sim/simulation/defensive';
import * as Offensive from '@sim/simulation/offensive';
import { DefaultRandomProvider, Dice } from 'dice-typescript';
import * as _ from 'lodash';

import * as Attack from './attack';

export class Simulator {
  log: (message: string) => void = _message => { };

  simulate(encounter: Encounter, battles: number): SimulationResult {
    const simulationResult: SimulationResult = {
      battles,
      wins: { monster: 0, player: 0 },
      survivors: {},
      averageRounds: 0
    };

    encounter.creatures.forEach(c => {
      simulationResult.survivors[c.name] = 0;
    });

    this.log(`Running simulation ${battles} times.`);
    for (let x = 0; x < battles; x++) {
      const encounterResult = this.run(encounter);

      this.log(`Outcome of battle ${x + 1} is: ${encounterResult.winner} after ${encounterResult.rounds} rounds.`);
      this.log(`Survivors were: ${encounterResult.survivors.sort().join(', ')}`);

      simulationResult.averageRounds += encounterResult.rounds;
      simulationResult.wins[encounterResult.winner]++;
      encounterResult.survivors.forEach(s => {
        simulationResult.survivors[s] += 1;
      });
    }
    simulationResult.averageRounds /= battles;

    return simulationResult;
  }

  run(encounter: Encounter): EncounterResult {
    const round = _.cloneDeep(encounter);
    this.setDefaults(round);
    this.begin(round);
    this.log(`Initiative order: ${this.turnOrder(round.creatures).map(c => c.name).join(', ')}.`)
    let winner: CreatureType;
    let rounds = 0;
    while (!(winner = this.winner(round))) {
      this.round(round);
      rounds++;
    }
    return {
      winner,
      rounds,
      survivors: round.creatures.filter(c => c.hp > 0).map(c => c.name)
    };
  }

  setDefaults(encounter: Encounter) {
    encounter.approach = encounter.approach || Approach.offensive;
    encounter.critical = encounter.critical || Critical.rollTwice;
    encounter.defensive = encounter.defensive || Defensive.random;
    encounter.offensive = encounter.offensive || Offensive.random;
    encounter.random = encounter.random || new DefaultRandomProvider();
    if (!encounter.roll) {
      const dice = new Dice();
      encounter.roll = input => dice.roll(input).total;
    }
  }

  begin(encounter: Encounter) {
    encounter.creatures.forEach(c => {
      if (c.hp === undefined) { c.hp = c.maxHp; }
      if (c.initiative === undefined) { c.initiative = encounter.roll('1d20') + c.initiativeMod; }
    });
  }

  round(encounter: Encounter) {
    this.turnOrder(encounter.creatures).forEach(c => {
      if (c.hp > 0) { this.turn(c, encounter); }
    });
  }

  turn(creature: Creature, encounter: Encounter) {
    const approach = encounter.approach(creature, encounter);
    const action = approach === 'offensive'
      ? encounter.offensive(creature, encounter)
      : encounter.defensive(creature, encounter);
    if (action.targets.length === 0) { return; }

    this.log(`${creature.name} (${creature.hp}/${creature.maxHp}hp) is taking ${approach} action `
      + `against ${action.targets.map(t => t.name).join(', ')} `
      + `using ${action.action.name}.`);

    // TODO: Take different action if it's defensive.
    this.attack(action.action, action.targets, encounter);

    // TODO: Consume usage of action / spell slots.
  }

  attack(action: Action, targets: Creature[], encounter: Encounter) {
    targets.forEach(target => {
      const hit = Attack.doesHit(action, target, encounter.roll);
      const damages = Attack.calculateDamage(action, hit, encounter.roll, encounter.critical);
      this.log(`${action.name} ${hit} ${target.name} for ${Attack.totalDamage(damages, target)}.`);

      this.dealDamage(target, damages);
    });
  }

  dealDamage(target: Creature, damages: Damage[]) {
    target.hp -= Attack.totalDamage(damages, target);
    this.log(`${target.name} has ${target.hp}/${target.maxHp}hp.`)
  }

  winner(encounter: Encounter): CreatureType {
    if (encounter.creatures.filter(c => c.type === 'player' && c.hp > 0).length === 0) { return 'monster'; }
    if (encounter.creatures.filter(c => c.type === 'monster' && c.hp > 0).length === 0) { return 'player'; }
    return undefined;
  }

  turnOrder(creatures: Creature[]): Creature[] {
    return _.orderBy(creatures, c => c.initiative, 'desc');
  }
}
