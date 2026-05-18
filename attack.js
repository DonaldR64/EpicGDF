DefenderSave = function(defender) {
    let saveTarget = defender.defense;
    let critMod = 0;
    let saveTip = "<br>Defense: " + saveTarget + "+";

    if (losResult.building === true) {
        saveTarget--;
        saveTip += "<br>Building +1 Defense";
    }

    if (weapon.ap !== 0) {
        saveTip += "<br>Weapon AP: " + weapon.ap;
        if ((defender.keywords.includes("Fortified") || defenderAuras.includes("Fortified")) && weapon.ap > 0) {
            saveTip += "<br>Fortified -1 to AP";
            saveTarget += (weapon.ap -1);
        } else {
            saveTarget += weapon.ap;
        }
    }
    if (weapon.keywords.includes("Decimate") && defender.defense > 1 && defender.defense < 4) {
        saveTarget += 2;
        saveTip += "<br>Decimate +2AP vs Defense 2-3";
    }

    if ((attacker.keywords.includes("Ranged Slayer") || attackerAura.includes("Ranged Slayer")) && combatType === "Ranged" && defender.toughness > 2) {
        saveTarget += 2;
        saveTip += "<br>Ranged Slayer +2AP vs Tough 3+";
    }
    if ((attacker.keywords.includes("Slayer") || attackerAura.includes("Slayer")) && defender.toughness > 2) {
        if ((attacker.keywords.includes("Ranged Slayer") || attackerAura.includes("Ranged Slayer"))) {
            if (combatType === "Ranged") {
                saveTarget += 2;
                saveTip += "<br>Ranged Slayer +2AP vs Tough 3+";
            }
        } else {
            saveTarget += 2;
            saveTip += "<br>Slayer +2AP vs Tough 3+";
        }
    }

    if (defender.keywords.includes("Shielded") && weapon.type !== "Spell") {
        saveTarget--;
        saveTip += "<br>Shielded +1 Defense";
    }

    if (weapon.keywords.includes("Thrust") && attacker.id === state.Epic.activeID && combatType === "Melee") {
        saveTarget++;
        saveTip += "<br>Thrust +1 AP";
    }
    /*
    if ('Versatile Attack +1 AP') {
        saveTarget++;
        saveTip += "<br>Versatile Attack +1AP";
    }
    if ('Unpredictable +1 AP') {
        saveTarget++;
        saveTip += "<br>Unpredictable Attack +1AP";
    }
    if ('Unpredictable FIghter +1 AP') {
        saveTarget++;
        saveTip += "<br>Unpredictable Attack +1AP";
    }
    if ('Versatile Defense +1 Defense or the aura') {
        saveTarget--;
        saveTip += "<br>Versatile Defense +1 Defense";
    }

    */


    let saveInfo = {
        saveTarget: saveTarget,
        saveTip: saveTip,
    }

    return saveInfo
}