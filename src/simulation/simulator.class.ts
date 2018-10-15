import { CreatureModel } from '@sim/creature';
import { DiceRoller, Encounter, EncounterStrategy } from '@sim/encounter';
import { DefaultDiceRoller } from './default-dice-roller.class';
import { DefaultEncounterStrategy } from './default-encounter-strategy.class';

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
  public strategy: EncounterStrategy;
  public dice: DiceRoller;
  constructor(strategy?: EncounterStrategy, dice?: DiceRoller) {
    this.strategy = strategy || new DefaultEncounterStrategy();
    this.dice = dice || new DefaultDiceRoller();
  }

  simulate(models: CreatureModel[], battles: number): SimulationResult {
    const result: SimulationResult = {
      battles,
      wins: { monster: 0, player: 0 },
      survivors: Object.assign({}, ...models.map(c => ({ [c.name]: 0 }))),
      averageRounds: 0
    };

    for (let x = 0; x < battles; x++) {
      const encounter = new Encounter(this.strategy, this.dice, models);
      const encounterResult = encounter.run();
      console.log(JSON.stringify(encounterResult.transcript, null, 2));

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
