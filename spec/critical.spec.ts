import { EncounterCreature } from '@sim/models/creature';
import * as Critical from '@sim/simulation/critical';
import { Dice } from 'dice-typescript';

import * as Providers from './utils/dice';

describe('critical', () => {
  describe('rollTwice', () => {
    it('should roll the damage dice twice.', () => {
      const dice = new Dice(null, new Providers.SequentialProvider([4, 3, 2, 1]));
      const roller = i => dice.roll(i).total;

      const total = Critical.rollTwice(roller, { dice: '2d6', mod: 1 });
      expect(total).toEqual(11);
    })
  });
  describe('doubleDice', () => {
    it('should roll the damage dice once and double them.', () => {
      const dice = new Dice(null, new Providers.SequentialProvider([4, 3, 2, 1]));
      const roller = i => dice.roll(i).total;

      const total = Critical.doubleDice(roller, { dice: '2d6', mod: 1 });
      expect(total).toEqual(15);
    })
  });
  describe('maxPlus', () => {
    it('should max the damage dice once and roll again.', () => {
      const dice = new Dice(null, new Providers.SequentialProvider([4, 3, 2, 1]));
      const roller = i => dice.roll(i).total;

      const total = Critical.maxPlus(roller, { dice: '2d6', mod: 1 });
      expect(total).toEqual(20);
    })
  });
});
