import { CreatureModel, EncounterStrategy } from '@sim/models';

import { DefaultEncounterStrategy } from './default-encounter-strategy.class';
import { Encounter } from './encounter';

export interface SimulationResult {
  battles: number;
  wins: {
    player: number;
    monster: number;
  };
  survivors: {
    [name: string]: number;
  }
  averageRounds: number;
}

export class Simulator {
  public strategy: EncounterStrategy
  constructor(strategy?: EncounterStrategy) {
    this.strategy = strategy || new DefaultEncounterStrategy();
  }

  simulate(models: CreatureModel[], battles: number): SimulationResult {
    const result: SimulationResult = {
      battles,
      wins: { monster: 0, player: 0 },
      survivors: Object.assign({}, ...models.map(c => ({ [c.name]: 0 }))),
      averageRounds: 0
    };

    for (let x = 0; x < battles; x++) {
      const encounter = new Encounter(this.strategy, models);
      const encounterResult = encounter.run();

      result.averageRounds += encounterResult.rounds;
      result.wins[encounterResult.winner]++;
      encounterResult.survivors.forEach(c => {
        result.survivors[c.name] += 1;
      });
    }
    result.averageRounds /= battles;

    return result;
  }

}
