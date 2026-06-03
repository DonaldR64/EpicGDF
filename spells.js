const Spells = {
    "Elder Protection": {
        cost: 1,
        description: "Pick one friendly unit within 6 hexes, which gets Resistance once (next time the effect would apply)",
        friendly: true,
        targets: 1,
        range: 6,
        buff: "Resistance",
        debuff: "",
        hits: 0,
        ap: 0,
        special: "",
        sound: "Holy",
    },
    "Death Bolt": {
        cost: 1,
        description: "Pick one enemy unit within 3 Hexes, which takes 1 hit with Deadly(3) and Tear.",
        friendly: false,
        targets: 1,
        range: 3,
        buff: "",
        debuff: "",
        hits: 1,
        ap: 0,
        special: "Deadly(3), Tear",
        sound: "Zap",
    },
    "Path of War": {
        cost: 2,
        description: "Pick up to two friendly units within 6 Hexes, which get Ferocious Boost once (next time the effect would apply).",
        friendly: true,
        targets: 2,
        range: 6,
        buff: "Ferocious Boost",
        debuff: "",
        hits: 0,
        ap: 0,
        special: "",
        sound: "Holy",
    },
    "Psychic Vomit": {
        cost: 2,
        description: "Pick one enemy unit within 3 Hexes, which takes 6 hits with Bane.",
        friendly: false,
        targets: 1,
        range: 3,
        buff: "",
        debuff: "",
        hits: 6,
        ap: 0,
        special: "Bane",
        sound: "Zap",
    },
    "Head Bang": {
        cost: 3,
        description: "Pick up to three enemy units within 9 Hexes, which friendly units gets Rending in melee against once (next time the effect would apply).",
        friendly: false,
        targets: 3,
        range: 9,
        buff: "",
        debuff: "Rending Against",
        hits: 0,
        ap: 0,
        special: "",
        sound: "Zap",
    },
    "Crackling Bolt": {
        cost: 3,
        description: "Pick one enemy unit within 9 Hexes, which takes 3 hits with Blast(3).",
        friendly: false,
        targets: 1,
        range: 9,
        buff: "",
        debuff: "",
        hits: 3,
        ap: 0,
        special: "Blast(3)",
        sound: "Zap",
    },












};