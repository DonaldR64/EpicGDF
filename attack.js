//change 3rd bit in ! to be gone, is CC if range is 0

const Attack = (msg) => {
    let Tag = msg.content.split(";");
    let attacker = UnitArray[Tag[1]];
    let defender = UnitArray[Tag[2]];
    SetupCard(attacker.name,defender.name,attacker.faction);
    let weaponType = Tag[3]; //CCW, Rifle etc
    let hitInfo = attacker.Attack(defender,weaponType);
    defender.Damage(hitInfo);


    PrintCard();
}




//in class, Attack to do the attack and feed back hit Info with hits to apply
//output of Attacks to be in Attack


//in Damage - apply hits from hitInfo, rolling over to any hero if destroyed


