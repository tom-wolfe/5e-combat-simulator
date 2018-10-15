import { EncounterStrategy } from '@sim/encounter';
import { ActionStrategy, Approaches, ApproachStrategy, Criticals, DiceStrategy, Strategies } from '@sim/strategy';

export class DefaultEncounterStrategy implements EncounterStrategy {
  approach: ApproachStrategy = Approaches.offensive;
  offensive: ActionStrategy = Strategies.smartOffense;
  defensive: ActionStrategy = Strategies.random;
  critical: DiceStrategy = Criticals.rollTwice;
}
