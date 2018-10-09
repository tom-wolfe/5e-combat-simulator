import { Action, Creature, CreatureType, Damage, Encounter, EncounterResult, TargettedAction } from '@sim/models';
import { SimulationResult } from '@sim/models/simulation';
import * as Actions from '@sim/simulation/actions';
import * as Targets from '@sim/simulation/targets';
import * as Approach from '@sim/simulation/approach';
import * as Critical from '@sim/simulation/critical';
import * as Strategy from '@sim/simulation/strategy';
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

    this.log(`Running simulation ${battles} time(s).`);
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
      this.log(`Round ${rounds + 1}:`);
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
    encounter.defensive = encounter.defensive || Strategy.random;
    encounter.offensive = encounter.offensive || Strategy.smartOffense;
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
      if (c.hp > 0) {
        this.resetLegendaryActions(c);
        this.regenerate(c);
        this.turn(c, encounter);
        this.legendaryActions(c, encounter);
      }
    });
  }

  legendaryActions(creature: Creature, encounter: Encounter) {
    const legendary = encounter.creatures.filter(c => c.legendary && c !== creature && c.legendary.actions > 0);
    if (legendary.length === 0) { return; }
    legendary.forEach(c => {
      this.log(`${c.name} is taking a legendary action!`);
      this.turn(c, encounter, true);
    })
  }

  regenerate(creature: Creature) {
    if (!creature.regeneration) { return; }
    this.log(`${creature.name} regains ${creature.regeneration} hit points!`);
    creature.hp = Math.min(creature.hp + creature.regeneration, creature.maxHp);
  }

  resetLegendaryActions(creature: Creature) {
    if (creature.legendary) {
      if (creature.legendary.actions < creature.legendary.maxActions) {
        this.log(`${creature.name} regains spent legendary actions!`);
        creature.legendary.actions = creature.legendary.maxActions;
      } else {
        this.log(`${creature.name} has no legendary actions to regain.`);
      }
    }
  }

  turn(creature: Creature, encounter: Encounter, legendary: boolean = false) {
    const approach = encounter.approach(creature, encounter);
    const action = approach === 'offensive'
      ? this.offensive(creature, encounter, legendary)
      : this.defensive(creature, encounter, legendary);
    this.consumeResource(creature, action, legendary);
  }

  offensive(creature: Creature, encounter: Encounter, legendary: boolean = false): TargettedAction {
    const actions = Actions.possibleActions(creature, legendary);
    const targets = Targets.opposing(creature, encounter).filter(c => c.hp > 0);
    const action = encounter.offensive(creature, actions, targets, encounter);
    if (!action.action || action.targets.length === 0) {
      this.log(`${creature.name} has no action/target!`);
      return;
    }

    // TODO: Take different action if it's defensive.
    if (action.action.method === 'attack') {
      this.attack(creature, action.action, action.targets, encounter);
    } else {
      this.save(creature, action.action, action.targets, encounter);
    }
    return action;
  }

  defensive(creature: Creature, encounter: Encounter, legendary: boolean = false): TargettedAction {
    const actions = Actions.possibleActions(creature, legendary);
    const targets = Targets.allied(creature, encounter);
    const action = encounter.defensive(creature, actions, targets, encounter);
    if (!action.action || action.targets.length === 0) {
      this.log(`${creature.name} has no action/target!`);
      return;
    }

    // TODO: Healing and stuff.
    return action;
  }

  consumeResource(creature: Creature, action: TargettedAction, legendary: boolean) {
    if (!action) { return; }
    if (action.action.uses !== undefined) { action.action.uses--; }
    if (legendary && action.action.legendary) { creature.legendary.actions -= action.action.legendary; }
    if (action.castLevel) { creature.spellSlots[action.castLevel]--; }
  }

  attack(creature: Creature, action: Action, targets: Creature[], encounter: Encounter) {
    targets.forEach(target => {
      const hit = Attack.doesHit(action, target, encounter.roll);
      if (hit === 'miss') {
        this.log(`${creature.name} (${creature.hp}/${creature.maxHp}hp) missed ${target.name} with ${action.name}.`);
      } else {
        const damages = Attack.rollAllDamage(action, encounter.roll, hit === 'crit' ? encounter.critical : null);
        const damage = this.dealDamage(target, damages, false);
        this.log(`${creature.name} (${creature.hp}/${creature.maxHp}hp) ${hit} ${target.name} with ${action.name} for ${damage} damage.`
          + ` (${target.hp}hp remaining)`);
      }
    });
  }

  save(creature: Creature, action: Action, targets: Creature[], encounter: Encounter) {
    const damages = Attack.rollAllDamage(action, encounter.roll);

    let message = `${creature.name} uses ${action.name}.`;

    targets.forEach(target => {
      let hit = Attack.doesHit(action, target, encounter.roll);
      message += ` ${target.name} `;
      if (hit === 'miss') {
        message += 'made the save, ';
        // Made the save.
      } else {
        message += 'failed the save'
        // Failed the save
        if (target.legendary && target.legendary.resistances > 0) {
          hit = 'miss';
          target.legendary.resistances--;
          // But chose to succeed. (remaining)
          message += ` but chose to succeed ${target.legendary.resistances} resistances remaining, `;
        } else {
          message += ', ';
        }
      }

      const damage = this.dealDamage(target, damages, true);

      message += `taking ${damage || 'no'} damage. (${target.hp}hp remaining)`
    });

    this.log(message);
  }

  dealDamage(target: Creature, damages: Damage[], half: boolean): number {
    let damage = Attack.totalDamage(damages, target);
    if (half) { damage = Math.floor(damage / 2); }
    target.hp -= damage;
    return damage;
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
