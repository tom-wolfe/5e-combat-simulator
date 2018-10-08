import { ConstantProvider, SequentialProvider } from './dice';

describe('dice utils', () => {
  describe('ConstantProvider', () => {
    it('should provide the same dice roll all the time.', () => {
      const provider = new ConstantProvider(6)
      expect(provider.numberBetween(0, 100)).toBe(6);
      expect(provider.numberBetween(0, 5)).toBe(6);
      expect(provider.numberBetween(10, 20)).toBe(6);
    })
  });
  describe('SequentialProvider', () => {
    it('should provide the given list of dice rolls.', () => {
      const provider = new SequentialProvider([1, 2, 3, 4, 5, 6])
      expect(provider.numberBetween(0, 100)).toBe(1);
      expect(provider.numberBetween(0, 5)).toBe(2);
      expect(provider.numberBetween(10, 20)).toBe(3);
      expect(provider.numberBetween(0, 20)).toBe(4);
      expect(provider.numberBetween(10, 20)).toBe(5);
      expect(provider.numberBetween(0, 20)).toBe(6);
    })
  });
});
