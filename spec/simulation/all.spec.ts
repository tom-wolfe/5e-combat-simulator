import { Creature, Encounter } from '@sim/models';
import { Simulator } from '@sim/simulation/simulator';

const dartagnan: Creature = {
  name: 'D\'artagnan',
  type: 'player',
  ac: 16,
  maxHp: 27,
  initiativeMod: -1,
  saves: { str: 6, dex: 0, con: 4, int: 0, wis: -1, cha: 0 },
  actions: [
    {
      name: 'Lux Aeterna',
      method: 'attack',
      mod: 8,
      damages: [
        { dice: '1d8', mod: 6, type: 'slashing', magical: true },
        { dice: '1d8', mod: 0, type: 'radiant', magical: true }
      ]
    }
  ],
};

const sebastian: Creature = {
  name: 'Sebastian',
  type: 'player',
  ac: 15,
  maxHp: 27,
  initiativeMod: 2,
  saves: { str: 0, dex: 0, con: 4, int: 6, wis: 0, cha: 0 },
  actions: [
    {
      name: 'Fire Bolt', method: 'attack', mod: 6,
      damages: [{ dice: '1d8', type: 'fire', magical: true }]
    }
  ],
};

const patricia: Creature = {
  name: 'Patricia',
  type: 'player',
  ac: 13,
  maxHp: 27,
  initiativeMod: 2,
  saves: { str: 6, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  actions: [
    {
      name: 'Fire Bolt', method: 'attack', mod: 6,
      damages: [{ dice: '1d8', type: 'fire', magical: true }]
    }
  ],
};

const neferi: Creature = {
  name: 'Neferi',
  type: 'player',
  ac: 15,
  maxHp: 27,
  initiativeMod: 4,
  saves: { str: 6, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  actions: [
    {
      name: 'Sneak Attack', method: 'attack', mod: 6,
      damages: [
        { dice: '1d8', type: 'bludgeoning' },
        { dice: '2d6', type: 'bludgeoning' }
      ]
    }
  ],
};

const vennris: Creature = {
  name: 'Vennris',
  type: 'player',
  ac: 14,
  maxHp: 27,
  initiativeMod: 3,
  saves: { str: 6, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  actions: [
    {
      name: 'Fire Bolt', method: 'attack', mod: 6,
      damages: [{ dice: '1d8', type: 'fire', magical: true }]
    }
  ],
};

const monster: Creature = {
  name: 'Vampire',
  type: 'monster',
  ac: 16,
  maxHp: 102,
  initiativeMod: 3,
  legendary: {
    resistances: 3,
    actions: 3,
    maxActions: 3
  },
  regeneration: 10,
  alterations: [
    { alteration: 'resistant', type: 'necrotic' },
    { alteration: 'resistant', type: 'bludgeoning', mundaneOnly: true },
    { alteration: 'resistant', type: 'piercing', mundaneOnly: true },
    { alteration: 'resistant', type: 'slashing', mundaneOnly: true }
  ],
  saves: { str: 4, dex: 3, con: 4, int: 3, wis: 5, cha: 6 },
  actions: [
    {
      name: 'Multiattack (Grapple / Bite)', method: 'attack', mod: 7,
      legendary: 3,
      damages: [
        { dice: '1d6', mod: 4, type: 'piercing' },
        { dice: '2d6', mod: 0, type: 'necrotic' }
      ]
    },
    {
      name: 'Arms of Hadar',
      method: 'save', save: 'str', mod: 15, halfOnSuccess: true, uses: 1,
      damages: [{ dice: '4d6', mod: 0, type: 'cold' }]
    },
    {
      name: 'Blight',
      method: 'save', save: 'con', mod: 15, halfOnSuccess: true, uses: 1,
      damages: [{ dice: '6d8', mod: 0, type: 'cold' }]
    },
    {
      name: 'Shadow of Moil',
      method: 'attack', mod: 999, uses: 2,
      damages: [{ dice: '2d6', mod: 0, type: 'cold' }]
    }
  ],
};

const encounter: Encounter = {
  creatures: [dartagnan, sebastian, patricia, neferi, vennris, monster]
};

describe('ALL', () => {
  it('runs without error.', () => {
    const simulator = new Simulator();
    const battles = 1000;
    // simulator.log = console.log;
    const result = simulator.simulate(encounter, battles);

    const success = result.wins.player / battles * 100;
    let message = '\n';
    message += `Players have a ${success.toFixed(2)}% chance of success.`;
    Object.keys(result.survivors).forEach(s => {
      const n = result.survivors[s] / battles * 100;
      message += `\n${s} has a ${n.toFixed(2)}% chance of surviving.`;
    });
    message += `\nBattle lasted an average of ${result.averageRounds} rounds.`;
    console.log(message);
  });
});
