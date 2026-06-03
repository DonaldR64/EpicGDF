const Spells = {
    "Elder Protection": {
        Cost: 1,
        Description: "Pick one friendly unit within 6 hexes, which gets Resistance once (next time the effect would apply)",
        Friendly: true,
        Targets: 1,
        Range: 6,
        Buff: "Resistance",
        Debuff: "",
        Hits: 0,
        AP: 0,
        Special: "",
        Sound: "Holy",
    },
    "Death Bolt": {
        Cost: 1,
        Description: "Pick one enemy unit within 3 Hexes, which takes 1 hit with Deadly(3) and Tear.",
        Friendly: false,
        Targets: 1,
        Range: 3,
        Buff: "",
        Debuff: "",
        Hits: 1,
        AP: 0,
        Special: "Deadly(3), Tear",
        Sound: "Zap",
    },
    "Path of War": {
        Cost: 2,
        Description: "Pick up to two friendly units within 6 Hexes, which get Ferocious Boost once (next time the effect would apply).",
        Friendly: true,
        Targets: 2,
        Range: 6,
        Buff: "Ferocious Boost",
        Debuff: "",
        Hits: 0,
        AP: 0,
        Special: "",
        Sound: "Holy",
    },
    "Psychic Vomit": {
        Cost: 2,
        Description: "Pick one enemy unit within 3 Hexes, which takes 6 hits with Bane.",
        Friendly: false,
        Targets: 1,
        Range: 3,
        Buff: "",
        Debuff: "",
        Hits: 6,
        AP: 0,
        Special: "Bane",
        Sound: "Zap",
    },
    "Head Bang": {
        Cost: 3,
        Description: "Pick up to three enemy units within 9 Hexes, which friendly units gets Rending in melee against once (next time the effect would apply).",
        Friendly: false,
        Targets: 3,
        Range: 9,
        Buff: "",
        Debuff: "Rending Against",
        Hits: 0,
        AP: 0,
        Special: "",
        Sound: "Zap",
    },
    "Crackling Bolt": {
        Cost: 3,
        Description: "Pick one enemy unit within 9 Hexes, which takes 3 hits with Blast(3).",
        Friendly: false,
        Targets: 1,
        Range: 9,
        Buff: "",
        Debuff: "",
        Hits: 3,
        AP: 0,
        Special: "Blast(3)",
        Sound: "Zap",
    },












};