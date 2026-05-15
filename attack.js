


//in class, Attack to do the attack and feed back hit Info with hits to apply
//output of Attacks to be in Attack
class Test {

    Attack(defender,weaponType) {

        let attackerHex = HexMap[this.hexLabel];
        let defenderHex = HexMap[defender.hexLabel];
        //if hero, check if shuld be a normal unit, if so change
        if (defender.type === "Hero" && defenderHex.tokenIDs.length > 1 && weaponType !== "Sniper") {
            _.each(defenderHex.tokenIDs,tokenID => {
                let unit2 = UnitArray[tokenID];
                if (unit2.faction === defender.faction && unit2.id !== defender.id && unit2.type !== "Hero") {
                    defender = unit2;
                }
            })
        }       


        let attackerAuras = attacker.Auras();
        let attackerTT = attacker.TTip();
        let defenderAuras = defender.Auras();
        let defenderTT = defender.TTip();


        //error checks
        let errorMsg = [];
        //check attacking enemy
        if (attacker.faction === defender.faction) {
            errorMsg.push("Friendly Fire!");
        }     
        //Weapons - los, ranges, limited
        let losResult = LOS(this,defender);
        let combatType = (losResult.distance === 0) ? "Melee":"Ranged";
        let weaponArray = [];
        let notEligible = []; //weapons not eligible for various reasons
        for (let i=0;i<this.weapons.length;i++) {
            let weapon = DeepCopy(this.weapons[i]);
            let notE;
            if (weapon.type !== weaponType) {continue};
            if ((weapon.name === "Impact" && this.token.get(SM.fatigue) === true) || this.id !== state.Epic.activeID) {
                notE = weapon.name + " not eligible";
            }
            if (losResult.los === false && weapon.keywords.includes("Indirect") === false) {
                notE = weapon.name + " - no LOS";
            }
            if (attackerTT.includes("Fired " + weapon.name)) {
                notE = weapon.name + " Limited and Fired";
            }
            let range = (defender.type === "Aircraft" && weapon.keywords.includes("Unstoppable") === false) ? weapon.range - 6:weapon.range;
            if (this.keywords.includes("Increased Shooting Range") || attackerAuras.includes("Increased Shooting Range")) {
                range += 3;
            }
            if (losResult.distance > range && combatType === "Ranged") {
                notE = weapon.name + " - lacks Range";
            }
            if (weapon.type === "CC" && combatType === "Ranged") {
                notE = weapon.name + " is CC Only";
            }
            if (notE) {
                notEligible.push(notE)
            } else {
                weaponArray.push(weapon); //can add hits, rolls etc 
            }
        }
        if (weaponArray.length === 0) {
            errorMsg.push("No Weapons with LOS or Range");
            errorMsg = errorMsg.concat(notEligible);
        }
        if (ErrorMsg(errorMsg) === true) {
            return;
        }










    }

}





//in Damage - apply hits from hitInfo, rolling over to any hero if destroyed


