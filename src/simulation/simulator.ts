import { Creature } from '@sim/models/creature';
import { SimulationResult } from '@sim/models/simulation';

import { Encounter } from './encounter';

export class Simulator {
  simulate(creatures: Creature[], battles: number): SimulationResult {
    const encounter = new Encounter();
    const simulationResult: SimulationResult = {
      battles,
      wins: { monster: 0, player: 0 },
      survivors: {}
    }

    for (let x = 0; x < battles; x++) {
      const encounterResult = encounter.run(creatures);
      simulationResult.wins[encounterResult.winner]++;
      encounterResult.survivors.forEach(s => {
        simulationResult.survivors[s] = (simulationResult.survivors[s] || 0) + 1;
      });
    }

    return simulationResult;
  }
}
