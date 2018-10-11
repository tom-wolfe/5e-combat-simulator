import { CreatureModel, CreatureType, EncounterResult, EncounterStrategy } from '@sim/models';
import { SimulationResult } from '@sim/models/simulation';
import * as _ from 'lodash';
import { Creature } from './creature';
import { DefaultEncounterStrategy } from './default-encounter-strategy.class';

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
    const round = models.map(c => new Creature(c));

    this.begin(round);
    let winner: CreatureType;
    let rounds = 0;
    while (!(winner = this.winner(round))) {
      this.round(round);
      rounds++;
    }
    return {
      winner,
      rounds,
      survivors: round.filter(c => c.hp > 0).map(c => c.name)
    };
  }

  begin(creatures: Creature[]) {
    creatures.forEach(c => {
      c.rollInitiative(this.strategy.roll);
    });
  }

  round(creatures: Creature[]) {
    _.orderBy(creatures, c => c.initiative, 'desc').forEach(c => {
      if (c.hp > 0) {
        c.turn(this.strategy, creatures, false);
        this.legendaryActions(c, creatures);
      }
    });
  }

  legendaryActions(creature: Creature, creatures: Creature[]) {
    const legendary = creatures.filter(c => c.legendary && c !== creature && c.legendary.actions > 0);
    if (legendary.length === 0) { return; }
    legendary.forEach(c => {
      c.turn(this.strategy, creatures, true);
    });
  }

  winner(creatures: Creature[]): CreatureType {
    if (creatures.filter(c => c.type === 'player' && c.hp > 0).length === 0) { return 'monster'; }
    if (creatures.filter(c => c.type === 'monster' && c.hp > 0).length === 0) { return 'player'; }
    return undefined;
  }
}
