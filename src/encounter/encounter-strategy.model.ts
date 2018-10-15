import { ActionStrategy, ApproachStrategy, DiceStrategy } from '@sim/strategy';

export interface EncounterStrategy {
  approach: ApproachStrategy;
  offensive: ActionStrategy;
  defensive: ActionStrategy;
  critical: DiceStrategy;
}
