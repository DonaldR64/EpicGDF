//type - Buff, Debuff or damage
//keywords are an array of strings
const Spells = {
    "Elder Protection": {
        cost: 1,
        description: "Pick one friendly unit within 6 hexes, which gets Resistance once (next time the effect would apply)",
        type: "Buff",
        friendly: true,
        targets: 1,
        range: 6,
        buff: "Resistance",
        sound: "Angels",
    },
    "Death Bolt": {
        cost: 1,
        description: "Pick one enemy unit within 3 Hexes, which takes 1 hit with Deadly(3) and Tear.",
        type: "Damage",
        friendly: false,
        targets: 1,
        range: 3,
        hits: 1,
        ap: 0,
        keywords: ["Deadly(3)","Tear"],
        fx: "beam-death",
        sound: "Power",
    },
    "Path of War": {
        cost: 2,
        description: "Pick up to two friendly units within 6 Hexes, which get Ferocious Boost once (next time the effect would apply).",
        type: "Buff",
        friendly: true,
        targets: 2,
        range: 6,
        buff: "Ferocious Boost",
        sound: "Angels",
    },
    "Psychic Vomit": {
        cost: 2,
        description: "Pick one enemy unit within 3 Hexes, which takes 6 hits with Bane.",
        type: "Damage",
        friendly: false,
        targets: 1,
        range: 3,
        hits: 6,
        ap: 0,
        keywords: ["Bane"],
        fx: "burst-acid",
        sound: "Boom",
    },
    "Head Bang": {
        cost: 3,
        description: "Pick up to three enemy units within 9 Hexes, which friendly units gets Rending in melee against once (next time the effect would apply).",
        type: "Debuff",
        friendly: false,
        targets: 3,
        range: 9,
        debuff: "Rending Against",
        sound: "DCannon",
    },
    "Crackling Bolt": {
        cost: 3,
        description: "Pick one enemy unit within 9 Hexes, which takes 3 hits with Blast(3).",
        type: "Damage",
        friendly: false,
        targets: 1,
        range: 9,
        hits: 3,
        ap: 0,
        keywords: ["Blast(3)"],
        fx: "burst-magic",
        sound: "Boom",
    },












};