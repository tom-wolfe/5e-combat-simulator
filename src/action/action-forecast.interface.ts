import { Creature } from '@sim/creature';
import { ActionModel } from './action.model';

export interface ActionForecast {
  action: ActionModel;
  target: Creature;
  damage: number;
}
