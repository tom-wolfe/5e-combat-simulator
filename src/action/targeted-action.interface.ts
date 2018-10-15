import { Creature } from '@sim/creature';
import { ActionModel } from './action.model';

export interface TargetedAction {
  action: ActionModel;
  targets: Creature[];
  castLevel: number;
}
