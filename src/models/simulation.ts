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
