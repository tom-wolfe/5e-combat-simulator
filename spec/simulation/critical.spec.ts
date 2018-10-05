import * as Critical from '@sim/simulation/critical';
import * as Providers from '@spec/utils/dice';
import { Dice } from 'dice-typescript';

describe('critical', () => {
  describe('rollTwice', () => {
    it('should roll the damage dice twice.', () => {
      const dice = new Dice(null, new Providers.SequentialProvider([4, 3, 2, 1]));
      const roll = i => dice.roll(i).total;

      const total = Critical.rollTwice({ dice: '2d6', mod: 1, type: 'slashing' }, roll);
      expect(total).toEqual(11);
    })
  });
  describe('doubleDice', () => {
    it('should roll the damage dice once and double them.', () => {
      const dice = new Dice(null, new Providers.SequentialProvider([4, 3, 2, 1]));
      const roll = i => dice.roll(i).total;

      const total = Critical.doubleDice({ dice: '2d6', mod: 1, type: 'slashing' }, roll);
      expect(total).toEqual(15);
    })
  });
  describe('maxPlus', () => {
    it('should max the damage dice once and roll again.', () => {
      const dice = new Dice(null, new Providers.SequentialProvider([4, 3, 2, 1]));
      const roll = i => dice.roll(i).total;

      const total = Critical.maxPlus({ dice: '2d6', mod: 1, type: 'slashing' }, roll);
      expect(total).toEqual(20);
    })
  });
});
