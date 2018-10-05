import * as Approach from '@sim/simulation/approach';

describe('approach', () => {
  describe('offensive', () => {
    it('returns offensive.', () => {
      const result = Approach.offensive(null, null);
      expect(result).toEqual('offensive');
    });
  });
});
