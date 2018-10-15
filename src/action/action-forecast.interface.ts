import { Creature } from '@sim/creature';
import { Action } from './action.class';

export interface ActionForecast {
  action: Action;
  target: Creature;
  damage: number;
}
