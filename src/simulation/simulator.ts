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

  simulate(encounter: Encounter, battles: number): SimulationResult {
    const simulationResult: SimulationResult = {
      battles,
      wins: { monster: 0, player: 0 },
      survivors: {}
    }

    for (let x = 0; x < battles; x++) {
      const encounterResult = this.run(encounter);
      simulationResult.wins[encounterResult.winner]++;
      encounterResult.survivors.forEach(s => {
        simulationResult.survivors[s] = (simulationResult.survivors[s] || 0) + 1;
      });
    }

    return simulationResult;
  }

  run(encounter: Encounter): EncounterResult {
    const round = _.cloneDeep(encounter);
    this.setDefaults(round);
    this.begin(round);
    let winner: CreatureType;
    while (!(winner = this.winner(round))) {
      this.round(round);
    }
    return {
      winner,
      survivors: round.creatures.filter(c => c.hp > 0).map(c => c.name)
    };
  }

  setDefaults(encounter: Encounter) {
    encounter.approach = encounter.approach || Approach.offensive;
    encounter.critical = encounter.critical || Critical.rollTwice;
    encounter.defensive = encounter.defensive || Defensive.first;
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

    // TODO: Take different action if it's defensive.
    this.attack(action.action, action.targets, encounter);
  }

  attack(action: Action, targets: Creature[], encounter: Encounter) {
    targets.forEach(target => {
      const hit = Attack.doesHit(action, target, encounter.roll);
      const damages = Attack.calculateDamage(action, hit, encounter.roll, encounter.critical);
      this.dealDamage(target, damages);
    });
  }

  dealDamage(target: Creature, damages: Damage[]) {
    target.hp -= Attack.totalDamage(damages);
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
