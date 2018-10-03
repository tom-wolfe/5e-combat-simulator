const Random = require('random-js');
const random = new Random(Random.engines.mt19937().autoSeed());

module.exports = {
  roll: function (roll) {
    const i = roll.toLowerCase().split('d').map(Number);
    return random.dice(i[1], i[0]).reduce((p, c) => p + c, 0);
  }
}