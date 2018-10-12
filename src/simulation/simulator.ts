import { CreatureModel, CreatureType, EncounterResult, EncounterStrategy } from '@sim/models';
import { SimulationResult } from '@sim/models/simulation';
import * as _ from 'lodash';
import { Creature } from './creature';
import { DefaultEncounterStrategy } from './default-encounter-strategy.class';
import { Encounter } from './encounter';

export class Simulator {
  public strategy: EncounterStrategy
  constructor(strategy?: EncounterStrategy) {
    this.strategy = strategy || new DefaultEncounterStrategy();
  }

  simulate(models: CreatureModel[], battles: number): SimulationResult {
    const simulationResult: SimulationResult = {
      battles,
      wins: { monster: 0, player: 0 },
      survivors: {},
      averageRounds: 0
    };

    models.forEach(c => {
      simulationResult.survivors[c.name] = 0;
    });

    for (let x = 0; x < battles; x++) {
      const encounterResult = this.run(models);
      simulationResult.averageRounds += encounterResult.rounds;
      simulationResult.wins[encounterResult.winner]++;
      encounterResult.survivors.forEach(s => {
        simulationResult.survivors[s] += 1;
      });
    }
    simulationResult.averageRounds /= battles;

    return simulationResult;
  }

  run(models: CreatureModel[]): EncounterResult {
    const creatures = models.map(c => new Creature(c));
    const encounter = new Encounter(this.strategy, creatures);

    encounter.rollInitiative();

    let winner: CreatureType;
    let rounds = 0;
    while (!(winner = encounter.winner())) {
      this.round(creatures);
      rounds++;
    }
    return { winner, rounds, survivors: encounter.survivors.map(c => c.name) };
  }

  round(creatures: Creature[]) {
    _.orderBy(creatures, c => c.initiative, 'desc').forEach(c => {
      if (c.hp > 0) {
        c.turn(false);
        this.legendaryActions(c, creatures);
      }
    });
  }

  legendaryActions(creature: Creature, creatures: Creature[]) {
    const legendary = creatures.filter(c => c.legendary && c !== creature && c.legendary.actions > 0);
    if (legendary.length === 0) { return; }
    legendary.forEach(c => {
      c.turn(true);
    });
  }

}
