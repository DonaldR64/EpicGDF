



    WeaponAttack = () => {
        let attackerHex = HexMap[attacker.hexLabel];
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
        for (let i=0;i<attacker.weapons.length;i++) {
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
                if (weapon.ketwords.includes("Deadly")) {
                    weaponArray.unshift(weapon);                
                } else {
                    weaponArray.push(weapon);                
                }

            }
        }
        if (weaponArray.length === 0) {
            errorMsg.push("No Weapons with LOS or Range");
            errorMsg = errorMsg.concat(notEligible);
        }
        if (ErrorMsg(errorMsg) === true) {
            return;
        }

        //run through weapons
        for (let w=0;w++;w<weaponArray.length) {
            let weapon = weaponArray[w];
            let rolls = [], hits = 0, crits = 0
        let relentless = 0,surge = 0, furious = 0,predator = 0,butcher = 0;
        let notes = [];
            let needed = attacker.quality;
            let neededTip = "<br>Quality: " + quality + "+";

            if (attacker.token.get(SM.fatigue) === true && combatType === "Melee") {
                needed = 6;
                neededTip = "<br>Fatigue: 6+";
            }
            if (weapon.name === "Ravage") {
                needed = 6;
                neededTip = "<br>Ravage: 6+";
            }
            if (weapon.name === "Impact") {
                needed = 2;
                neededTip = "<br>Impact: 2+";
            }
            if (weapon.keywords.includes("Reliable")) {
                needed = 2;
                neededTip = "<br>Reliable: 2+";
            }

            let blast = weapon.keywords.find(key => key.includes("Blast")) || "0";
            blast = parseInt(blast.replace(/\D/g,''));

            let cover;
            let hitTip = "", tip;
            //modifiers here
            //cover
            let ignoreCover = ["Unstoppable","Blast","Slam","Decimate"];
            if (weapon.keywords.includes("Indirect")) {
                //ignores hedges etc
                cover = losResult.hexCover;
            } else {
                //if either edge or target terrain gives cover
                cover = (losResult.hexCover === true || losResult.interCover === true) ? true:false;
            }
            if (cover === true) {
                for (let i=0;i<weapon.keywords.length; i++) {
                    for (let j=0;j<ignoreCover.length;j++) {
                        if (weapon.keywords[i].includes(ignoreCover[j])) {
                            cover = false;
                            neededTip += "<br>" + ignoreCover[j] + " ignores Cover";
                        }
                    }
                }  
            }

            //Positive To Hits
            if (attacker.keywords.includes("Artillery") && losResult.distance > 4) {
                needed -= 1;
                neededTip += "<br>Artillery at Range +1 to Hit";
            }
            if (attacker.upTH === true) {
                needed -= 1;
                neededTip += "<br>Unpredictable +1 to Hit";
            }
            if (attackerTT.includes(TT.vATH)) {
                needed -= 1;
                neededTip += "<br>" + TT.vATH;
            }
            if (attacker.tokenID === state.Epic.activeID && combatType === "Melee" && weapon.keywords.includes("Thrust")) {
                weapon.ap++;
                notes.push("Thrust");
                needed -= 1;
                neededTip += "<br>Thrust/Charge +1 to Hit";
            }
            if (attacker.keywords.includes("Precise")) {
                needed -= 1;
                neededTip += "<br>Precise +1 to Hit";
            }
            if (attacker.keywords.includes("Targeting Visor") && losResult.distance > 4) {
                if (attacker.keywords.includes("Targeting Visor Boost") || attackerAuras.includes("Targeting Visor Boost")) {
                    needed -= 2;
                    neededTip += "<br>Targeting Visor & Boost +2 to Hit";
                } else {
                    needed -= 1;
                    neededTip += "<br>Targeting Visor +1 to Hit";
                }
            }
            if (attacker.keywords.includes("Good Shot") && combatType === "Ranged") {
                needed--;
                neededTip += "<br>Good Shot +1 to Hit";
            }
            if (defender.token.get(SM.spotter) === true || defender.token.get(SM.spotter) > 0) {
                let spotter = 1;
                if (defender.token.get(SM.spotter) > 1) {
                    spotter = parseInt(defender.token.get(SM.spotter));
                }
                needed -= spotter;
                neededTip += "<br>Spotting Mark +" + spotter + " to Hit";
                defender.token.set(SM.spotter,false); //used
            }

            //Negative To Hits - removed by Unstoppable
            if (weapon.keywords.includes("Unstoppable") === false) {
                if (cover === true && combatType === "Ranged") {
                    needed += 1;
                    neededTip += "<br>Cover -1 to Hit";
                }
                if (weapon.keywords.includes("Indirect") && attacker.moved === true) {
                    needed += 1;
                    neededTip += "<br>Indirect and Moved -1 to Hit";
                }
                if ((defender.keywords.includes("Stealth") || defenderAuras.includes("Stealth")) && losResult.distance > 4) {
                    needed += 1;
                    neededTip += "<br>Stealth -1 to Hit";
                }
                if (defenderTT.includes(TT.vDTH)) {
                    needed += 1;
                    neededTip += "<br>" + TT.vDTH;
                }
                if (attacker.keywords.includes("Evasive")) {
                    needed++;
                    neededTip += "<br>Evasive -1 to Hit";
                }
                if (defender.keywords.includes("Artillery") && losResult.distance > 4) {
                    needed += 2;
                    neededTip += "<br>Artillery being shot at > 4 hexes";
                }
            }

            //Number of Attacks
            let attacks = weapon.number * weapon.attacks;
            if (attacker.get(SM.halfStr) === true) {
                attacks = Math.floor(attacks/2);
            }
            if (attacks === 0) {
                attacks = 1;
                needed += 1;
                if (attacker.type === "Infantry") {
                    neededTip += "<br>Heavy Casualties -1 to Hit";
                } else {
                    neededTip += "<br>Unit Damaged -1 to Hit";
                }
            }






        }










    }





    Debuffs(phase) {
        if (phase === "Combat") {
            defender.RemoveTTip("piercing");
        }




    }

    Buffs(phase) {
        if (phase === "Combat") {
            if (randomInteger(6) < 4) {
                this.upAP = true;
                this.upTH = false;
            } else {
                this.upAP = false;
                this.upTH = true;
            }





        }





    }



//in Damage - apply hits from hitInfo, rolling over to any hero if destroyed



}








//in Damage - apply hits from hitInfo, rolling over to any hero if destroyed


