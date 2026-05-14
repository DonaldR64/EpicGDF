const Main = (() => {
    const version = '2026.5.11';
    if (!state.Epic) {state.Epic = {}};

    const pageInfo = {};
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ","BA","BB","BC","BD","BE","BF","BG","BH","BI"];

    let HexSize, HexInfo, DIRECTIONS;

    //math constants
    const M = {
        f0: Math.sqrt(3),
        f1: Math.sqrt(3)/2,
        f2: 0,
        f3: 3/2,
        b0: Math.sqrt(3)/3,
        b1: -1/3,
        b2: 0,
        b3: 2/3,
    }

    const DefineHexInfo = () => {
        HexSize = (70 * pageInfo.scale)/M.f0;
        if (pageInfo.type === "hex") {
            HexInfo = {
                size: HexSize,
                pixelStart: {
                    x: 35 * pageInfo.scale,
                    y: HexSize,
                },
                width: 70  * pageInfo.scale,
                height: pageInfo.scale*HexSize,
                xSpacing: 70 * pageInfo.scale,
                ySpacing: 3/2 * HexSize,
                directions: {
                    "Northeast": new Cube(1,-1,0),
                    "East": new Cube(1,0,-1),
                    "Southeast": new Cube(0,1,-1),
                    "Southwest": new Cube(-1,1,0),
                    "West": new Cube(-1,0,1),
                    "Northwest": new Cube(0,-1,1),
                },
                halfToggleX: 35 * pageInfo.scale,
                halfToggleY: 0,
            }
            DIRECTIONS = ["Northeast","East","Southeast","Southwest","West","Northwest"];
        } else if (pageInfo.type === "hexr") {
            //Hex H or Flat Topped
            HexInfo = {
                size: HexSize,
                pixelStart: {
                    x: HexSize,
                    y: 35 * pageInfo.scale,
                },
                width: pageInfo.scale*HexSize,
                height: 70  * pageInfo.scale,
                xSpacing: 3/2 * HexSize,
                ySpacing: 70 * pageInfo.scale,
                directions: {
                    "North": new Cube(0, -1, 1),
                    "Northeast": new Cube(1, -1, 0),
                    "Southeast": new Cube(1,0,-1),
                    "South": new Cube(0,1,-1),
                    "Southwest": new Cube(-1,1,0),
                    "Northwest": new Cube(-1,0,1),
                },
                halfToggleX: 0,
                halfToggleY: 35 * pageInfo.scale,
            }
            DIRECTIONS = ["North","Northeast","Southeast","South","Southwest","Northwest"];
        }
    }

    let UnitArray = {};

    let outputCard = {title: "",subtitle: "",side: "",body: [],buttons: [],};

    const Factions = {
        "Neutral": {
            "image": "",
            "dice": "Neutral",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#00FF00",
            "borderStyle": "5px ridge",
        },
        "Plague Disciples": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/353239057/GIITPAhD-JdRRD2D6BREWw/thumb.png?1691112406",
            "dice": "Deathguard",
            "backgroundColour": "#B3CF99",
            "objColour": "#00ff00",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px ridge",
        },
        "Alien Hives": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/362007142/CjTYql17F5VDkqGlW_yorg/thumb.png?1696555948",
            "dice": "Tyranids",
            "backgroundColour": "#800080",
            "objColour": "#8000809d",
            "titlefont": "Goblin One",
            "fontColour": "#f9b822",
            "borderColour": "#f9b822",
            "borderStyle": "5px ridge",
        },
        "Dao Union": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/354348305/k_izI31oM8lRsHHma1xfag/thumb.png?1691855991",
            "dice": "Tau",
            "backgroundColour": "#ffffff",
            "objColour": "#be0b07",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#be0b07",
            "borderStyle": "5px groove",
        },

    };


    const SM = {
        fatigue: "status_brown",
        halfStr: "status_Blood::2006465",
        spotter: "status_Bullseye::2006535",

    }

    const TT = {
        vAAP: "Versatile Attack = +1 AP",
        vATH: "Versatile Attack = +1 to Hit",
        vDD: "Versatile Defense = +1 to Defense",
        vDTH: "Versatile Defense = -1 to Be Hit",
        steadfast: "Steadfast Buff",
        piercing: "Piercing Shooting Mark +1 to AP",

    }


    const Capit = (val) => {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    //cover true,false, or Infantry for infantry only
    //building - is a building
    //blockLOS - blocks LOS beyond
    //height - height of terrain
    //type - Open, Difficult, Dangerous, Impassable or Impassable to Vehicles etc

    const TerrainInfo = {
        "Open": {name: "Open",cover: false, building: false, blockLOS: false,height: 0, type: "Open"},
        "Woods": {name: "Woods",cover: true, building: false, blockLOS: true,height: 2, type: "Difficult"},
        "Brick Building 1": {name: "Brick Building Height 1", cover: true,building: true, blockLOS: true,height: 1, type: "Difficult"},
        "Brick Building 2": {name: "Brick Building Height 2", cover: true, building: true, blockLOS: true,height: 1, type: "Difficult"},
        "Concrete Building 1": {name: "Concrete Building Height 1", cover: true,building: true, blockLOS: true,height: 1, type: "Difficult"},
        "Concrete Building 2": {name: "Concrete Building Height 2", cover: true, building: true, blockLOS: true,height: 1, type: "Difficult"},
        "Crops": {name: "Crops", cover: "Infantry", building: false, blockLOS: false, height: 0, type: "Open"},
        "Water": {name: "Water", cover: false, building: false, blockLOS: false,height: 0, type: "Impassable"},
        "Craters": {name: "Craters", cover: "Infantry",building: false, blockLOS: false,height: 0, type: "Difficult"},
        "Ruined Building": {name: "Ruined Building", cover: true,building: false, blockLOS: false,height: 0, type: "Difficult"},
        "Ruined Concrete": {name: "Ruined Concrete Building", cover: true,building: false, blockLOS: false, height: 0, type: "Difficult"},





    }

    const EdgeInfo = {
        "#00ff00": {name: "Hedge"},
        "#980000": {name: "Wall"},



    }



    const RoadInfo = ["#d9d9d9"];





    const simpleObj = (o) => {
        let p = JSON.parse(JSON.stringify(o));
        return p;
    };

    const getCleanImgSrc = (imgsrc) => {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    };

    const tokenImage = (img) => {
        //modifies imgsrc to fit api's requirement for token
        img = getCleanImgSrc(img);
        img = img.replace("%3A", ":");
        img = img.replace("%3F", "?");
        img = img.replace("med", "thumb");
        return img;
    };

    const DeepCopy = (variable) => {
        variable = JSON.parse(JSON.stringify(variable))
        return variable;
    };

    const PlaySound = (name) => {
        let sound = findObjs({type: "jukeboxtrack", title: name})[0];
        if (sound) {
            sound.set({playing: true,softstop:false});
        }
    };

    const FX = (fxname,unit1,unit2) => {
        //unit2 is target, unit1 is shooter
        //if its an area effect, unit1 isnt used
        if (fxname.includes("System")) {
            //system fx
            fxname = fxname.replace("System-","");
            if (fxname.includes("Blast")) {
                fxname = fxname.replace("Blast-","");
                spawnFx(unit2.token.get("left"),unit2.token.get("top"), fxname);
            } else {
                spawnFxBetweenPoints(new Point(unit1.token.get("left"),unit1.token.get("top")), new Point(unit2.token.get("left"),unit2.token.get("top")), fxname);
            }
        } else {
            let fxType =  findObjs({type: "custfx", name: fxname})[0];
            if (fxType) {
                spawnFxBetweenPoints(new Point(unit1.token.get("left"),unit1.token.get("top")), new Point(unit2.token.get("left"),unit2.token.get("top")), fxType.id);
            }
        }
    }






    const pointInPolygon = (point,vertices) => {
        //evaluate if point is in the polygon
        px = point.x
        py = point.y
        collision = false
        len = vertices.length - 1
        for (let c=0;c<len;c++) {
            vc = vertices[c];
            vn = vertices[c+1]
            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x-vc.x)*(py-vc.y)/(vn.y-vc.y)+vc.x)) {
                collision = !collision
            }
        }
        return collision
    }

    const translatePoly = (poly) => {
        //translate points in a pathv2 polygon to map points
        let vertices = [];
        let points = JSON.parse(poly.get("points"));
        let centre = new Point(poly.get("x"), poly.get("y"));
        //covert path points from relative coords to actual map coords
        //define 'bounding box;
        let minX = Infinity,minY = Infinity, maxX = 0, maxY = 0;
        _.each(points,pt => {
            minX = Math.min(pt[0],minX);
            minY = Math.min(pt[1],minY);
            maxX = Math.max(pt[0],maxX);
            maxY = Math.max(pt[1],maxY);
        })
        //translate each point back based on centre of box
        let halfW = (maxX - minX)/2 + minX;
        let halfH = (maxY - minY)/2 + minY
        let zeroX = centre.x - halfW;
        let zeroY = centre.y - halfH;
        _.each(points,pt => {
            let x = Math.round(pt[0] + zeroX);
            let y = Math.round(pt[1] + zeroY);
            vertices.push(new Point(x,y));
        })
        return vertices;
    }


    const KeyNum = (unit,keyword) => {
        let key = unit.keywords.split(",");
        log(key)
        let num = 1;
        _.each(key,word => {
            if (word.includes(keyword)) {
                word = word.trim().replace(keyword,"").replace("(","").replace(")","");
                num = parseInt(word);
            }
            log(num)
        })
        return num;
    }









    //Retrieve Values from character Sheet Attributes
    const Attribute = (character,attributename) => {
        //Retrieve Values from character Sheet Attributes
        let attributeobj = findObjs({type:'attribute',characterid: character.id, name: attributename})[0]
        let attributevalue = "";
        if (attributeobj) {
            attributevalue = attributeobj.get('current');
        }
        return attributevalue;
    };

    const AttributeArray = (characterID) => {
        let aa = {}
        let attributes = findObjs({_type:'attribute',_characterid: characterID});
        for (let j=0;j<attributes.length;j++) {
            let name = attributes[j].get("name")
            let current = attributes[j].get("current")   
            if (!current || current === "") {current = " "} 
            aa[name] = current;
            let max = attributes[j].get("max")   
            if (!max || max === "") {max = " "} 
            aa[name + "_max"] = max;
        }
        return aa;
    };

    const AttributeSet = (characterID,attributename,newvalue,max) => {
        if (!max) {max = false};
        let attributeobj = findObjs({type:'attribute',characterid: characterID, name: attributename})[0]
        if (attributeobj) {
            if (max === true) {
                attributeobj.set("max",newvalue)
            } else {
                attributeobj.set("current",newvalue)
            }
        } else {
            if (max === true) {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    max: newvalue,
                    characterid: characterID,
                });            
            } else {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    characterid: characterID,
                });            
            }
        }
        return;
    };

    const DeleteAttribute = (characterID,attributeName) => {
        let attributeObj = findObjs({type:'attribute',characterid: characterID, name: attributeName})[0]
        if (attributeObj) {
            attributeObj.remove();
        }
    }

    class Point {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        };
        toOffset() {
            let cube = this.toCube();
            let offset = cube.toOffset();
            return offset;
        };
        toCube() {
            let x = this.x - HexInfo.pixelStart.x;
            let y = this.y - HexInfo.pixelStart.y;
            let q,r;
            if (pageInfo.type === "hex") {
                q = (M.b0 * x + M.b1 * y) / HexInfo.size;
                r = (M.b3 * y) / HexInfo.size;
            } else if (pageInfo.type === "hexr") {
                q = (M.b3 * x) / HexInfo.size;
                r = (M.b1 * x + M.b0 * y) / HexInfo.size;
            }
            let cube = new Cube(q,r,-q-r).round();
            return cube;
        };
        distance(b) {
            return Math.sqrt(((this.x - b.x) * (this.x - b.x)) + ((this.y - b.y) * (this.y - b.y)));
        }
        label() {
            return this.toCube().label();
        }
    }

    class Offset {
        constructor(col,row) {
            this.col = col;
            this.row = row;
        }
        label() {
            let label = rowLabels[this.row] + (this.col + 1).toString();
            return label;
        }
        toCube() {
            let q,r;
            if (pageInfo.type === "hex") {
                q = this.col - (this.row - (this.row&1))/2;
                r = this.row;
            } else if (pageInfo.type === "hexr") {
                q = this.col;
                r = this.row - (this.col - (this.col&1))/2;
            }
            let cube = new Cube(q,r,-q-r);
            cube = cube.round(); 
            return cube;
        }
        toPoint() {
            let cube = this.toCube();
            let point = cube.toPoint();
            return point;
        }
    };

    const Angle = (theta) => {
        while (theta < 0) {
            theta += 360;
        }
        while (theta >= 360) {
            theta -= 360;
        }
        return theta
    }   

    class Cube {
        constructor(q,r,s) {
            this.q = q;
            this.r =r;
            this.s = s;
        }

        add(b) {
            return new Cube(this.q + b.q, this.r + b.r, this.s + b.s);
        }
        angle(b) {
            //angle between 2 hexes
            let origin = this.toPoint();
            let destination = b.toPoint();

            let x = Math.round(origin.x - destination.x);
            let y = Math.round(origin.y - destination.y);
            let phi = Math.atan2(y,x);
            phi = phi * (180/Math.PI);
            phi = Math.round(phi);
            phi -= 90;
            phi = Angle(phi);
            return phi;
        }        
        subtract(b) {
            return new Cube(this.q - b.q, this.r - b.r, this.s - b.s);
        }
        static direction(direction) {
            return HexInfo.directions[direction];
        }
        neighbour(direction) {
            //returns a hex (with q,r,s) for neighbour, specify direction eg. hex.neighbour("NE")
            return this.add(HexInfo.directions[direction]);
        }
        neighbours() {
            //all 6 neighbours
            let results = [];
            for (let i=0;i<DIRECTIONS.length;i++) {
                results.push(this.neighbour(DIRECTIONS[i]));
            }
            return results;
        }

        len() {
            return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
        }
        distance(b) {
            return this.subtract(b).len();
        }
        lerp(b, t) {
            return new Cube(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t);
        }
        linedraw(b) {
            //returns array of hexes between this hex and hex 'b' incl. hex 'b'
            var N = this.distance(b);
            var a_nudge = new Cube(this.q + 1e-06, this.r + 1e-06, this.s - 2e-06);
            var b_nudge = new Cube(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);
            var results = [];
            var step = 1.0 / Math.max(N, 1);
            for (var i = 1; i <= N; i++) {
                results.push(a_nudge.lerp(b_nudge, step * i).round());
            }
            return results;
        }

        linedraw2(b) {
            //returns array of hexes between this hex and hex 'b' incl. hex 'b', nudging other way from above 
            var N = this.distance(b);
            var a_nudge = new Cube(this.q - 1e-06, this.r - 1e-06, this.s + 2e-06);
            var b_nudge = new Cube(b.q - 1e-06, b.r - 1e-06, b.s + 2e-06);
            var results = [];
            var step = 1.0 / Math.max(N, 1);
            for (var i = 1; i <= N; i++) {
                results.push(a_nudge.lerp(b_nudge, step * i).round());
            }
            return results;
        }



        label() {
            let offset = this.toOffset();
            let label = offset.label();
            return label;
        }

        spiralToCube(index) {
            if (index === 0) {
                return this;
            } else {
                let radius = (index === 0) ? 0:Math.floor((Math.sqrt(12 * index - 3) + 3) / 6);
                let startIndex = (radius === 0) ? 0: 1 + 3 * radius * (radius - 1);
                let ring = this.ring(radius);
                let pos = index - startIndex;
                return ring[pos];
            }
        }




        radius(rad) {
            //returns array of hexes in radius rad
            //Not only is x + y + z = 0, but the absolute values of x, y and z are equal to twice the radius of the ring
            let results = [];
            let h;
            for (let i = 0;i <= rad; i++) {
                for (let j=-i;j<=i;j++) {
                    for (let k=-i;k<=i;k++) {
                        for (let l=-i;l<=i;l++) {
                            if((Math.abs(j) + Math.abs(k) + Math.abs(l) === i*2) && (j + k + l === 0)) {
                                h = new Cube(j,k,l);
                                results.push(this.add(h));
                            }
                        }
                    }
                }
            }
            return results;
        }

        ring(radius) {
            let results = [];
            let b = new Cube(-1 * radius,0,1 * radius);  //start at west 
            let cube = this.add(b);
            for (let i=0;i<6;i++) {
                //for each direction
                for (let j=0;j<radius;j++) {
                    results.push(cube);
                    cube = cube.neighbour(DIRECTIONS[i]);
                }
            }
            return results;
        }

        round() {
            var qi = Math.round(this.q);
            var ri = Math.round(this.r);
            var si = Math.round(this.s);
            var q_diff = Math.abs(qi - this.q);
            var r_diff = Math.abs(ri - this.r);
            var s_diff = Math.abs(si - this.s);
            if (q_diff > r_diff && q_diff > s_diff) {
                qi = -ri - si;
            }
            else if (r_diff > s_diff) {
                ri = -qi - si;
            }
            else {
                si = -qi - ri;
            }
            return new Cube(qi, ri, si);
        }
        toPoint() {
            let x,y;
            if (pageInfo.type === "hex") {
                x = (M.f0 * this.q + M.f1 * this.r) * HexInfo.size;
                y = 3/2 * this.r * HexInfo.size;
            } else if (pageInfo.type === "hexr") {
                x = 3/2 * this.q * HexInfo.size;
                y = (M.f1 * this.q + M.f0 * this.r) * HexInfo.size;
            }
            x += HexInfo.pixelStart.x;
            y += HexInfo.pixelStart.y;
            let point = new Point(x,y);
            return point;
        }
        toOffset() {
            let col,row;
            if (pageInfo.type === "hex") {
                col = this.q + (this.r - (this.r&1))/2;
                row = this.r;
            } else if (pageInfo.type === "hexr") {
                col = this.q;
                row = this.r + (this.q - (this.q&1))/2;
            }
            let offset = new Offset(col,row);
            return offset;
        }
        whatDirection(b) {
            let delta = new Cube(b.q - this.q,b.r - this.r, b.s - this.s);
            let dir = "Unknown";
            let keys = Object.keys(HexInfo.directions);
            for (let i=0;i<6;i++) {
                let d = HexInfo.directions[keys[i]];
                if (d.q === delta.q && d.r === delta.r && d.s === delta.s) {
                    dir = keys[i];
                }
            }
            return dir
        }

     
    };

    class Hex {
        //hex will have its elevation and the hexes terrain which can reference TerrainInfo for other details
        constructor(point) {
            this.centre = point;
            let offset = point.toOffset();
            this.offset = offset;
            this.tokenIDs = [];
            this.cube = offset.toCube();
            this.label = offset.label();
            this.elevation = 0;
            this.terrain = "Open";
            this.cover = false;
            this.terrainHeight = 0;
            this.blockLOS = false;
            this.building = false;
            this.type = "Open";
            this.edges = {};
            _.each(DIRECTIONS,a => {
                this.edges[a] = "Open";
            });
            HexMap[this.label] = this;
        }

        distance(b) {
            let dist = this.cube.distance(b.cube);
            return dist;
        }




    }

    class Unit {
        constructor(id) {
            let token = findObjs({_type:"graphic", id: id})[0];
            let cube = (new Point(token.get("left"),token.get("top"))).toCube();
            let label = cube.label();
            let charID = token.get("represents");
            let char = getObj("character", charID); 

            let aa = AttributeArray(charID);
  
            this.charName = char.get("name");
            let name = token.get("name");
            if (!name || name === "") {
                name = this.charName;
            }
            this.name = name;

            this.id = id;
            this.charID = charID;
            let faction = aa.faction || "Neutral";

            this.faction = faction;
    
            let player = (state.Epic.factions.indexOf(faction));
            if (player === -1) {
                if (faction === "Neutral") {
                    player = 2
                } else {
                    state.Epic.factions.push(faction);
                    player = state.Epic.factions.length - 1;
                }
            }
            this.player = player;

            this.quality = parseInt(aa.quality);
            this.defense = parseInt(aa.defense);
            this.toughness = parseInt(aa.toughness) || 1;
            this.wounds = parseInt(aa.wounds) || 1;
            this.type = aa.type;
            this.size = (aa.type === "Titan") ? 2:1;



            let keywords = [];

            //Unit Keywords, separated by a comma
            let unitKey = aa.unitkeywords || " ";
            unitKey = unitKey.split(",");
            _.each(unitKey,key => {
                keywords.push(key.trim());
            })

            //upgrades, which may be in [ ] with flavour text before
            let keywordDisplay = "";
            let flavours = {};
            for (let i=1;i<11;i++) {
                let eq = "key" + i + "equipped";
                let k = "key" + i + "name";
                if (aa[eq] === "Equipped") {
                    let keyword = aa[k].trim();
                    let flavour;
                    if (!keyword) {continue};
                    if (i > 1) {keywordDisplay += "<br>"};
                    keywordDisplay += keyword;
                    if (keyword.includes("[")) {
                        let i1 = keyword.indexOf("[");
                        let i2 = keyword.indexOf("]");
                        flavour = keyword.substring(0,i1);
                        keyword = keyword.substring(i1 + 1,i2);
                    }
                    keyword = keyword.trim();
                    keywords.push(keyword);
                    if (flavour !== "") {
                        flavours[keyword] = flavour;
                    }
                }
            }
            this.keywords = keywords;
            this.flavours = flavours;

            let weapons = [];
            for (let i=1;i<11;i++) {
                if (aa["weapon" + i + "equipped"] === "Equipped") {
                    let key = (aa["weapon" + i + "special"] || " ").split(",");
                    let keywords = key.map((e) => e.trim()) || [""];

                    let weapon = {
                        name: aa["weapon" + i + "name"],
                        type: aa["weapon" + i + "type"],
                        range: parseInt(aa["weapon" + i + "range"]) || 0,
                        attacks: parseInt(aa["weapon" + i + "attack"]) || 1,
                        ap: parseInt(aa["weapon" + i + "ap"]) || 0,
                        keywords: keywords,
                        fx: aa["weapon" + i + "fx"],
                        sound: aa["weapon" + i + "sound"],
                    }
                    weapons.push(weapon);
                }
            }

            let ravage = keywords.find((e) => e.includes("Ravage")) || "0";
            ravage = parseInt(ravage.replace(/\D/g,''));
            if (ravage > 0) {
                let weapon = {name: "Ravage",type: "CCW",range: 0,attacks: ravage,ap: 0,keywords: [""],fx: "",sound: "Growl"};
                weapons.push(weapon);
            }

            let impact = keywords.find((e) => e.includes("Impact")) || "0";
            impact = parseInt(impact.replace(/\D/g,''));
            if (impact > 0) {
                let weapon = {name: "Impact",type: "CCW",range: 0,attacks: impact,ap: 0,keywords: [""],fx: "",sound: ""};
                weapons.push(weapon);
            }

            this.weapons = weapons;
            this.moved = false;
            this.hexLabel = label;
            this.prevHexLabel = label;

            this.token = token;

            UnitArray[id] = this;
            let index = HexMap[label].tokenIDs.indexOf(id);
            if (index < 0) {
                HexMap[label].tokenIDs.push(id);
            }

            log(this);

        }

        Morale() {
            let target = this.quality;
            let tip = "Quality: " + target;

            let hero = Hero(this);
            if (hero && hero !== false) {
                if (hero.quality < target) {
                    tip = "Hero's Quality: " + hero.quality;
                    target = hero.quality;
                }
            }

            let auras = this.Auras();
            let moraleRoll = randomInteger(6);
            let shaken = false;

            if (this.token.get("tint_color") === "#ff0000") {
                target++;
                tip += "<br>Shaken -1";
                shaken = true;
            }
            if (this.keywords.includes("Hive Bond") || auras.includes("Hive Bond")) {
                if (this.keywords.includes("Hive Bond Boost") || auras.includes("Hive Bond Boost")) {
                    target -= 2;
                    tip += "<br>Hive Bond Boost +2";
                } else {
                    target--;
                    tip += "<br>Hive Bond +1";
                }
            }

            target = Math.max(2,target);
            let success = (moraleRoll >= target || moraleRoll === 6) ? true:false;

            //fearless
            if (this.keywords.includes("Fearless") && success === false) {
                let fearlessRoll = randomInteger(6);
                if (fearlessRoll > 3) {
                    tip += "<br>Unit is Fearless!";
                    success = true;
                } else {
                    tip += "<br>Unit is not Fearless!";
                }
                tip += + " [Roll " + fearlessRoll + "]"
            }

            //after failure changes - automatic
            extra = [];
            if (this.keywords.includes("No Retreat") && success === false) {
                success = true;
                extra.push("The Test is still Passed due to No Retreat");
                let hp = parseInt(this.token.get("bar1_value"));
                let wounds = 0;
                let noRRolls = [];
                _.each(hp,e => {
                    let roll = randomInteger(6);
                    noRRolls.push(roll);
                    if (roll < 4) {wounds++};
                })
                noRRolls = noRRolls.sort((a,b) => b-a);
                let wtip = "Rolls: " + noRRolls.toString() + " vs. 4+";
                wtip = '[' + wounds + '](#" class="showtip" title="' + wtip + ')';
                extra.push("No Retreat causes " + wtip + " Wounds");
                let destroyed = this.Damage(wounds);
                if (destroyed === true) {
                    extra.push(this.name + " is Destroyed!");
                }
            }

            tip = '[' + target + '](#" class="showtip" title="' + tip + ')';

            SetupCard(unit.name,"Morale",unit.faction);

            outputCard.body.push("Morale Roll: " + DisplayDice(moraleRoll,Factions[this.faction].dice,24) + "vs. " + tip + "+");
            outputCard.body.push("[hr]");

            if (extra.length > 0) {
                _.each(extra,line => {
                    outputCard.body.push(line);
                })
            } else {
                if (success === true) {
                    outputCard.body.push("Success!");
                } else {
                    outputCard.body.push("Failure!");
                    if (shaken === true) {
                        outputCard.body.push("Shaken Unit Routs!");
                        this.Destroyed();
                    } else {
                        outputCard.body.push("Failure! Unit is Shaken");
                        unit.token.set("tint_color","#ff0000");
                        if (this.token.get(SM.halfStr) === true) {
                            outputCard.body.push("If this was a Melee, Remove the Unit as it Routs!");
                        }                        
                    }
                }
            }
            PrintCard();
        }

        Auras() {
            ///checks if model or assoc hero has an active aura and returns their names
            let auras = this.keywords.filter((e) => e.includes("Aura"));
            let hero = this.Hero();
            if (hero && hero !== false) {
                auras = auras.concat(hero.keywords.filter((e) => e.includes("Aura")));
            }
            auras = auras.map((e) => e.replace(" Aura",""));
            auras = [...new Set(auras)];
            return auras;
        }

        Hero() {
            if (this.size === 2) {return false}; //heros cannot boost Titans
            let hex = HexMap[this.hexLabel];
            _.each(hex.tokenIDs,tokenID => {
                if (tokenID !== this.id) {
                    let unit2 = UnitArray[tokenID];
                    if (unit2.type === "Hero") {
                        return unit2;
                    }
                }
            })
            return false;
        }

        TTip() {
            let tooltip = this.token.get("tooltip") || "";
            tooltip = tooltip.split(",");
            tooltip = tooltip.map((e) => e.trim());
            return tooltip;
        }

        SetTT(tip) {
            let tooltip = this.token.get("tooltip") || "";
            if (tooltip !== "") {tooltip += ","};
            tooltip += TT[tip];
            this.token.set("tooltip",tooltip);
        }

        RemoveTTip(tip) {
            let tooltip = this.token.get("tooltip") || "";
            tooltip = tooltip.split(",");
            tooltip = tooltip.map((e) => e.trim());
            tip = TT[tip];
            let index = tooltip.indexOf(tip);
            if (index > -1) {
                tooltip.splice(index,1);
                if (tooltip.length === 0) {
                    tooltip = "";
                } else {
                    tooltip = tooltip.toString();
                }
                this.token.set("tooltip",tooltip);
            }
        }

        Damage(wounds) {



        }





    }



    summonToken = function(cID,left,top,size = 70) {
        let character = getObj("character", cID);
        let newToken;
        character.get('defaulttoken',function(defaulttoken){
            const dt = JSON.parse(defaulttoken);
            let img = dt.imgsrc;
            img = tokenImage(img);
            if(dt && img){
                dt.imgsrc=img;
                dt.left=left;
                dt.top=top;
                dt.pageid = pageInfo.page.get('id');
                dt.layer = "objects";
                dt.width = size;
                dt.height = size;
                newToken = createObj("graphic", dt);
            } else {
                sendChat('','/w gm Cannot create token for <b>'+character.get('name')+'</b>');
            }
        });
        return newToken;
    }



    const AddAbility = (abilityName,action,characterID) => {
        createObj("ability", {
            name: abilityName,
            characterid: characterID,
            action: action,
            istokenaction: true,
        })
    }    


    const AddAbilities = (msg) => {
        if (!msg.selected) {return};
        let id = msg.selected[0]._id;
        let unit = UnitArray[id];  
        if (!unit) {
            unit = new Unit(id);
        }
        AddAbilities2(unit)
    }
        
    const AddAbilities2 = (unit) => {
        let keywordList = unit.keywords;

        unit.token.set({
            disableSnapping: true,
        })

        let abilityName,action;
        let abilArray = findObjs({_type: "ability", _characterid: unit.charID});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 
        
        let types = {
            "Rifle": [],
            "Pistol": [],
            "Heavy": [],
            "Heavy2": [],
            "Heavy3": [],
            "Mod": [],
            "CCW": [],
            "Sniper": [],
            "Bomb": [],
        }
  
        for (let i=0;i<unit.weapons.length;i++) {
            let weapon = unit.weapons[i];
            let name = weapon.name;
            if (weapon.type === " " || weapon.name === " ") {continue}
            if (weapon.keywords.includes("Limited")) {
                name += " (Limited)";
            }
            keywordList = keywordList.concat(weapon.keywords)
            types[weapon.type].push(name); 
        }
        
        let keys = Object.keys(types);
        let weaponNum = 1;


        for (let i=0;i<keys.length;i++) {
            let names = types[keys[i]];
            if (names.length === 0) {continue};
            names = names.toString();
            if (names.charAt(0) === ",") {names = names.replace(",","")};
            names = names.replaceAll(",","+");
            abilityName = weaponNum + ": " + names;
            weaponNum += 1;
            let ct = (keys[i] === ("CCW")) ? "Melee":"Ranged";
            action = "!Attack;@{selected|token_id};@{target|token_id};" + ct + ";" + keys[i];
            AddAbility(abilityName,action,unit.charID);
        }

        //activation 
        let orders = ";?{Order|Hold|Advance|Charge/Rush}";
        if (unit.type === "Aircraft") {orders = ";Advance"};
        if (unit.keywords.includes("Artillery") || unit.keywords.includes("Immobile")) {orders = ";Hold"}

        action = "!Activate;@{selected|token_id}" + orders;
        AddAbility("Activate",action,unit.charID);


       //special ability macros
        let specials = [{name: "Dangerous Terrain Debuff", targets: 1, range: 9},{name: "Mend", targets: 1, range: 2},{name: "Piercing Shooting Mark", targets: 1, range: 9},{name: "Precision Spotter", targets: 1, range: 18},{name: "Steadfast Buff", targets: 1, range: 6}];

        _.each(specials,special => {
            let t = "";
            if (unit.keywords.includes(special.name)) {
                if (special.targets === "Self") {
                    t = ";@{selected|token_id}";
                } else {
                    if (special.targets === 1) {
                        t = ";@{target|token_id}";
                    } else {
                        for (let i=1;i<=special.targets;i++) {
                            t += ";@{target|Target " + i + "|token_id}";
                        }
                    }
                }
                abilityName = unit.flavours[special.name];
                action = "!Special;" + special.name + ";" + special.range + ";@{selected|token_id}" + t;
                AddAbility(abilityName,action,unit.charID);
            }
        })
















        //keywords list 
        keywordList = [...new Set(keywordList)];
        keywordList = keywordList.filter(Boolean);
        keywordList = keywordList.map((e) => {
            if (e.includes("(")) {
                e = e.split("(")[0] + "(X)";
            }
            let item = {
                name: e,
                text: Keywords[e] || "Not in Database",
            }
            return item;
        })
        
        keywordList = keywordList.sort((a,b) => a.name.localeCompare(b.name))
        for (let i=0;i<12;i++) {
            let abName = "spec" + i + "Name";
            let abTextName = "spec" + i + "Text";
            let name = " ";
            let text = " ";
            if (i < keywordList.length) {
                name = keywordList[i].name;
                text = keywordList[i].text;
            }


            AttributeSet(unit.charID,abName,name);
            AttributeSet(unit.charID,abTextName,text);
        }

        sendChat("","Abilities Added")
    }


    const InlineButtons = (array) => {
        let output = "";
        for (let i=0;i<array.length;i++) {
            let info = array[i];
            let inline = true;
            if (i>0 && inline === false) {
                output += '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">';
            }
            let out = "";
            let borderColour = Factions[outputCard.side].borderColour;
            if (inline === false || i===0) {
                out += `<div style="display: table-row; background: #FFFFFF;; ">`;
                out += `<div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: center; display:block;'>`;
            }
            if (inline === true) {
                out += '<span>     </span>';
            }
            out += `<a style ="background-color: ` + Factions[outputCard.side].backgroundColour + `; padding: 5px;`
            out += `color: ` + Factions[outputCard.side].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
            out += `border-color: ` + borderColour + `; font-family: Tahoma; font-size: x-small; `;
            out += `"href = "` + info.action + `">` + info.phrase + `</a>`
            
            if (inline === false || i === (array.length - 1)) {
                out += `</div></span></div></div>`;
            }
            output += out;
        }
        return output;
    }

    const ButtonInfo = (phrase,action,inline) => {
        //inline - has to be true in any buttons to have them in same line -  starting one to ending one
        if (!inline) {inline = false};
        let info = {
            phrase: phrase,
            action: action,
            inline: inline,
        }
        outputCard.buttons.push(info);
    };

    const SetupCard = (title,subtitle,side) => {
        outputCard.title = title;
        outputCard.subtitle = subtitle;
        outputCard.side = side;
        outputCard.body = [];
        outputCard.buttons = [];
        outputCard.inline = [];
    };

    const DisplayDice = (roll,faction,size) => {
        roll = roll.toString();
        let tablename = Factions[faction].dice;
        let table = findObjs({type:'rollabletable', name: tablename})[0];
        if (!table) {
            table = findObjs({type:'rollabletable', name: "Neutral"})[0];
        }
        let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: roll })[0];   
        if (!obj) {return "NA"}
        let avatar = obj.get('avatar');
        let out = "<img width = "+ size + " height = " + size + " src=" + avatar + "></img>";
        return out;
    };

    const PrintCard = (id) => {
        let output = "";
        if (id) {
            let playerObj = findObjs({type: 'player',id: id})[0];
            let who = playerObj.get("displayname");
            output += `/w "${who}"`;
        } else {
            output += "/desc ";
        }

        if (!outputCard.side || !Factions[outputCard.side]) {
            outputCard.side = "Neutral";
        }

        //start of card
        output += `<div style="display: table; border: ` + Factions[outputCard.side].borderStyle + " " + Factions[outputCard.side].borderColour + `; `;
        output += `background-color: #EEEEEE; width: 100%; text-align: center; `;
        output += `border-radius: 1px; border-collapse: separate; box-shadow: 5px 3px 3px 0px #aaa;;`;
        output += `"><div style="display: table-header-group; `;
        output += `background-color: ` + Factions[outputCard.side].backgroundColour + `; `;
        output += `background-image: url(` + Factions[outputCard.side].image + `), url(` + Factions[outputCard.side].image + `); `;
        output += `background-position: left,right; background-repeat: no-repeat, no-repeat; background-size: contain, contain; align: center,center; `;
        output += `border-bottom: 2px solid #444444; "><div style="display: table-row;"><div style="display: table-cell; padding: 2px 2px; text-align: center;"><span style="`;
        output += `font-family: ` + Factions[outputCard.side].titlefont + `; `;
        output += `font-style: normal; `;

        let titlefontsize = "1.4em";
        if (outputCard.title.length > 12) {
            titlefontsize = "1em";
        }

        output += `font-size: ` + titlefontsize + `; `;
        output += `line-height: 1.2em; font-weight: strong; `;
        output += `color: ` + Factions[outputCard.side].fontColour + `; `;
        output += `text-shadow: none; `;
        output += `">`+ outputCard.title + `</span><br /><span style="`;
        output += `font-family: Arial; font-variant: normal; font-size: 13px; font-style: normal; font-weight: bold; `;
        output += `color: ` +  Factions[outputCard.side].fontColour + `; `;
        output += `">` + outputCard.subtitle + `</span></div></div></div>`;

        //body of card
        output += `<div style="display: table-row-group; ">`;

        let inline = 0;

        for (let i=0;i<outputCard.body.length;i++) {
            let out = "";
            let line = outputCard.body[i];
            if (!line || line === "") {continue};
            if (line.includes("[INLINE")) {
                let end = line.indexOf("]");
                let substring = line.substring(0,end+1);
                let num = substring.replace(/[^\d]/g,"");
                if (!num) {num = 1};
                line = line.replace(substring,"");
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: center; display:block;'>`;
                out += line + " ";

                for (let q=0;q<num;q++) {
                    let info = outputCard.inline[inline];
                    out += `<a style ="background-color: ` + Factions[outputCard.side].backgroundColour + `; padding: 5px;`
                    out += `color: ` + Factions[outputCard.side].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                    out += `border-color: ` + Factions[outputCard.side].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                    out += `"href = "` + info.action + `">` + info.phrase + `</a>`;
                    inline++;                    
                }
                out += `</div></span></div></div>`;
            } else {
                line = line.replace(/\[hr(.*?)\]/gi, '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">');
                line = line.replace(/\[\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\](.*?)\[\/[\#]\]/g, "<span style='color: #$1;'>$2</span>"); // [#xxx] or [#xxxx]...[/#] for color codes. xxx is a 3-digit hex code
                line = line.replace(/\[[Uu]\](.*?)\[\/[Uu]\]/g, "<u>$1</u>"); // [U]...[/u] for underline
                line = line.replace(/\[[Bb]\](.*?)\[\/[Bb]\]/g, "<b>$1</b>"); // [B]...[/B] for bolding
                line = line.replace(/\[[Ii]\](.*?)\[\/[Ii]\]/g, "<i>$1</i>"); // [I]...[/I] for italics
                let lineBack,fontcolour;
                if (line.includes("[F]")) {
                    let ind1 = line.indexOf("[F]") + 3;
                    let ind2 = line.indexOf("[/f]");
                    let fac = line.substring(ind1,ind2);
                    if (Factions[fac]) {
                        lineBack = Factions[fac].backgroundColour;
                        fontcolour = Factions[fac].fontColour;
                    }
                    line = line.replace("[F]" + fac + "[/f]","");

                } else {
                    lineBack = (i % 2 === 0) ? "#D3D3D3": "#EEEEEE";
                    fontcolour = "#000000";
                }
                out += `<div style="display: table-row; background: ` + lineBack + `;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color:` + fontcolour + `; `;
                out += `"> <div style='text-align: center; display:block;'>`;
                out += line + `</div></span></div></div>`;                
            }
            output += out;
        }

        //buttons
        if (outputCard.buttons.length > 0) {
            for (let i=0;i<outputCard.buttons.length;i++) {
                let info = outputCard.buttons[i];
                let inline = info.inline;
                if (i>0 && inline === false) {
                    output += '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">';
                }
                let out = "";
                let borderColour = Factions[outputCard.side].borderColour;
                
                if (inline === false || i===0) {
                    out += `<div style="display: table-row; background: #FFFFFF;; ">`;
                    out += `<div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                    out += `"><span style="line-height: normal; color: #000000; `;
                    out += `"> <div style='text-align: center; display:block;'>`;
                }
                if (inline === true) {
                    out += '<span>     </span>';
                }
                out += `<a style ="background-color: ` + Factions[outputCard.side].backgroundColour + `; padding: 5px;`
                out += `color: ` + Factions[outputCard.side].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                out += `border-color: ` + borderColour + `; font-family: Tahoma; font-size: x-small; `;
                out += `"href = "` + info.action + `">` + info.phrase + `</a>`
                
                if (inline === false || i === (outputCard.buttons.length - 1)) {
                    out += `</div></span></div></div>`;
                }
                output += out;
            }

        }

        output += `</div></div><br />`;
        sendChat("",output);
        outputCard = {title: "",subtitle: "",side: "",body: [],buttons: [],};
    }

    //related to building hex map
    const LoadPage = () => {
        //build Page Info and flesh out Hex Info
        pageInfo.page = getObj('page', Campaign().get("playerpageid"));
        pageInfo.name = pageInfo.page.get("name");
        pageInfo.scale = pageInfo.page.get("snapping_increment");
        pageInfo.width = pageInfo.page.get("width") * 70;
        pageInfo.height = pageInfo.page.get("height") * 70;
        pageInfo.type = pageInfo.page.get("grid_type");

    }

    const BuildMap = () => {
        let startTime = Date.now();
        HexMap = {};

        let startX = HexInfo.pixelStart.x;
        let startY = HexInfo.pixelStart.y;
        let halfToggleX = HexInfo.halfToggleX;
        let halfToggleY = HexInfo.halfToggleY;
        if (pageInfo.type === "hex") {
            for (let j = startY; j <= pageInfo.height;j+=HexInfo.ySpacing){
                for (let i = startX;i<= pageInfo.width;i+=HexInfo.xSpacing) {
                    let point = new Point(i,j);     
                    let hex = new Hex(point);
                }
                startX += halfToggleX;
                halfToggleX = -halfToggleX;
            }
        } else if (pageInfo.type === "hexr") {
            for (let i=startX;i<=pageInfo.width;i+=HexInfo.xSpacing) {
                for (let j=startY;j<=pageInfo.height;j+=HexInfo.ySpacing) {
                    let point = new Point(i,j);     
                    let hex = new Hex(point);
                }
                startY += halfToggleY;
                halfToggleY = -halfToggleY;
            }
        }
        AddTerrain();    
        AddTokens();


        let elapsed = Date.now()-startTime;
        log("Hex Map Built in " + elapsed/1000 + " seconds");
    };



    const AddTerrain = () => {
        //part 1 - add hex terrain
        let tokens = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
        _.each(tokens,token => {
            let name = token.get("name") || " ";
            if (name === "Map") {
                mapEdge = Math.round(token.get("left") + (token.get("width")/2));
                return;
            }

            let terrain = TerrainInfo[name];
            let buildingTypes = ["Wood","Brick","Concrete"];
            if (terrain) {
                let centre = new Point(token.get("left"),token.get('top'));
                let centreLabel = centre.toCube().label();
                let hex = HexMap[centreLabel];
                if (hex.terrain !== "Open") {
                    //check if found the 2nd terrain before original terrain
                    if (name === "Woods" && hex.terrain === "Burning Woods") {
                        return;
                    }
                    if (name.includes("Building") && hex.terrain.includes("Ruined")) {
                        return;
                    }
                }

                hex.terrain = terrain.name;
                hex.cover = (hex.cover === false) ? terrain.cover:false;
                if (terrain.building === true) {
                    hex.building = true;
                }
                if (terrain.blockLOS === true) {
                    hex.blockLOS = true;
                }
                hex.terrainHeight = Math.max(hex.terrainHeight,terrain.height);
                if (terrain.type !== "Open") {
                    hex.type = terrain.type;
                }
//elevation later as hill hexes UNDER the other hexes


            }






        })

        //part 2 - add hedges and such, defined by paths
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "pathv2",layer: "map",});
        _.each(paths,path => {
            let type = EdgeInfo[path.get("stroke").toLowerCase()];
            if (type) {
                let vertices = translatePoly(path);
                //work through pairs of vertices
                for (let i=0;i<(vertices.length -1);i++) {
                    let pt1 = vertices[i];
                    let pt2 = vertices[i+1];
                    let midPt = new Point((pt1.x + pt2.x)/2,(pt1.y + pt2.y)/2);
                    //find nearest hex to midPt
                    let hexLabel = midPt.label();
                    //now run through that hexes neighbours and see what intersects with original line to identify the 2 neighbouring hexes
                    let hex1 = HexMap[hexLabel];
                    if (!hex1) {continue}
                    let pt3 = hex1.centre;
                    let neighbourCubes = hex1.cube.neighbours();
                    for (let j=0;j<neighbourCubes.length;j++) {
                        let k = j+3;
                        if (k> 5) {k-=6};
                        let hl2 = neighbourCubes[j].label();
                        let hex2 = HexMap[hl2];
                        if (!hex2) {continue}
                        let pt4 = hex2.centre;
                        let intersect = lineLine(pt1,pt2,pt3,pt4);
                        if (intersect) {
                            hex1.edges[DIRECTIONS[j]] = type;
                            hex2.edges[DIRECTIONS[k]] = type;
                        }
                    }
                }
            }
        })
    }
     
    const AddTokens = () => {
        UnitArray = {};
        //create an array of all tokens
        let start = Date.now();
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });

        let c = tokens.length;
        let s = (1===c?'':'s');     
        
        tokens.forEach((token) => {
            let character = getObj("character", token.get("represents"));   
            if (character) {
                let unit = new Unit(token.get("id"));



            }
        });
        let elapsed = Date.now()-start;
        log(`${c} token${s} checked in ${elapsed/1000} seconds - ` + Object.keys(UnitArray).length + " placed in Unit Array");
    }



    const stringGen = () => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(randomInteger(possible.length)));
        }
        return text;
    };




    const StartGame = () => {
        SetupCard("Start New Game","Turn 1","Neutral");
        _.each(UnitArray,unit => {
            if (unit.name.includes("Objective")) {
                unit.token.set({
                    layer: 'foreground',
                    aura1_color: "#ffffff",
                    aura1_radius: 2,

                })
            }
        })
        RemoveLines(["Deploy"]);
        PrintCard();
        ClearMarkers();
        state.Epic.turn = 1;
    }

    const NextTurn = () => {
        RemoveDead();
        if (state.Epic.turn === 0) {
            StartGame();
            return;
        }

        //check if any units havent activated
        let keys = Object.keys(UnitArray);

        let remaining = false;

        for (let i=0;i<keys.length;i++) {
            let unit = UnitArray[keys[i]];
            let token = unit.token;
            if (!token) {
                delete UnitArray[keys[i]];
                continue;
            }
            if (token && token.get("aura1_color") === "#00ff00") {
                sendPing(token.get("left"),token.get("top"), Campaign().get('playerpageid'), null, true); 
                SetupCard(unit.name,"",unit.faction);
                outputCard.body.push("Unit has not been activated");
                PrintCard();
                remaining = true;
                break;
            }
        }
        if (remaining === true) {return};

        //things at beginning of turn
        let notes = [];
        for (let i=0;i<keys.length;i++) {
            let unit = UnitArray[keys[i]];
log(unit.name)
            let unitTT = unit.TTip();
            unitAuras = unit.Auras();

            //Steadfast
            if ((unit.keywords.includes("Steadfast") || unitAuras.includes("Steadfast") || unitTT.includes("steadfast")) && (unit.token.get("tint_color") === "#ffff00")) {
                let steadRoll = randomInteger(6);
                if (steadRoll > 3) {
                    unit.token.set("tint_color","transparent");
                    if (unitTT.includes("steadfast")) {
                        RemoveTip(unit,TT.steadfast);
                        notes.push(unit.name + ": Rallies with Steadfast Buff");
                    } else {
                        notes.push(unit.name + ": Rallies with Steadfast");
                    }
                }
            }

            if (unit.name.includes("Objective")) {
                ObjectiveCheck(unit);
            }

        }

        state.Epic.turn += 1;
        let gameContinues = true;
        SetupCard("Turn " + state.Epic.turn,"","Neutral");
        if (notes.length > 0) {
            _.each(notes,note => {
                outputCard.body.push(note);
            })
        }

        if (state.Epic.turn > 6) {
            let roll = randomInteger(6);
            let needed = Math.min(state.Epic.turn - 3,6);
            outputCard.body.push("Prolonged: " + roll + " vs. " + needed + "+");                
            if (roll < needed) {
                gameContinues = false;
                outputCard.body.push("The Battle Ends");
            } else {                    
                outputCard.body.push("The Battle continues for at least one more turn...");
            }
            outputCard.body.push("[hr]");
        } 
        if (gameContinues === true) {
            let lastUnit = UnitArray[state.Epic.activeID];
            if (lastUnit) {
                outputCard.body.push(lastUnit.faction + " has the First Activation");
            } else {
                outputCard.body.push("The Faction that went last goes first this Turn");
            }
            ClearMarkers();
        } else {
            outputCard.body.push("The Game Ends");
        }
        PrintCard();
    }


    const ObjectiveCheck = (objective) => {
log("Objective Check");
log(objective.name)
        let factions = [];
        let objHex = HexMap[objective.hexLabel()];
        _.each(UnitArray, unit => {
            if (unit.tokenID !== objective.tokenID) {
    log(unit.name)
    log(unit.faction)
                let distance = objHex.distance(HexMap[unit.hexLabel()]);
    log("D: "  + distance)
                if (distance < 2 && factions.includes(unit.faction) === false) {
                    factions.push(unit.faction)
                }
            }
        })
log("Factions: ")
log(factions)
        if (factions.length === 1) {
            let c = Factions[factions[0]].objColour;
log(c)
            objective.token.set("aura1_color",c);
        }
        if (factions.length === 2) {
            objective.token.set("aura1_color","#ffffff");
        }    
    }



    const Attack = (msg) => {
        let Tag = msg.content.split(";");
        let attacker = UnitArray[Tag[1]];
        let attackerAuras = attacker.Auras();
        let attackerTT = attacker.TTip();
        let attackerHex = HexMap[attacker.hexLabel];
        let defender = UnitArray[Tag[2]];
        let defenderHex = HexMap[defender.hexLabel()];
        let defenderHero = defender.Hero;

        let combatType = Tag[3];  //Ranged, Melee
        let weaponType = Tag[4]; //CCW, Rifle etc
        let errorMsg = [];

        if (attacker.faction === defender.faction) {
            //see if can find the unit meant to be clicked on
            let flag = true;
            _.each(defenderHex.tokenIDs,tokenID => {
                let unit2 = UnitArray[tokenID];
                if (unit2.faction !== attacker.faction) {
                    defender = unit2;
                    flag = false;
                }
            })
            if (flag === true) {
                errorMsg.push("Friendly Fire!");
            }
        }

        if (defender.type === "Hero" && defenderHex.tokenIDs.length > 1 && weaponType !== "Sniper") {
            //if there is a normal unit in hex, switch
            _.each(defenderHex.tokenIDs,tokenID => {
                let unit2 = UnitArray[tokenID];
                if (unit2.faction === defender.faction && unit2.id !== defender.id && unit2.type !== "Hero") {
                    defender = unit2;
                }
            })
        }        

        let defenderAuras = defender.Auras();
        let defenderTT = defender.TTip();
        let defenderModels = Math.ceil(parseInt(defender.token.get("bar1_value")) / defender.toughness); //used for blast
        if (defenderHero) {defenderModels++};

        SetupCard(attacker.name,defender.name,attacker.faction);

        let losResult = LOS(attacker,defender);

        if (losResult.los === false && weapon.keywords.includes("Indirect") === false) {
            errorMsg.push("No LOS to Target");
        }

        if (ErrorMsg(errorMsg) === true) {
            return;
        }

        if (attacker.keywords.includes("Unpredictable") || (attacker.keywords.includes("Unpredictable Fighter") && combatType === "Melee")) {
            let roll = randomInteger(6);
            if (roll < 4) {
                attacker.upAP = true;
                attacker.upTH = false;
            } else {
                attacker.upAP = false;
                attacker.upTH = true;            }
        }

///




            let weaponArray = [];
            let no = [];
            let totalWounds = 0;
            for (let i=0;i<attacker.weapons.length;i++) {
                let weapon = DeepCopy(attacker.weapons[i]);
                if (weapon.type !== weaponType) {continue};
                if (weapon.name === "Impact" && (attacker.token.get(SM.fatigue) === true || attacker.tokenID !== state.GDF3.activeID)) {
                    no.push(weapon.name + " not eligible");
                    continue;
                }
                if (losResult.los === false && weapon.keywords.includes("Indirect") === false) {
                    no.push(weapon.name + " - no LOS");
                    continue;
                }
                if (attackerTT.includes("Fired " + weapon.name)) {
                    no.push(weapon.name + " Limited and Fired");
                    continue;
                }


                let range = (defender.type === "Aircraft" && weapon.keywords.includes("Unstoppable") === false) ? weapon.range - 6:weapon.range;
                if (attacker.keywords.includes("Increased Shooting Range") || attackerAuras.includes("Increased Shooting Range")) {
                    range += 3;
                }
                if (losResult.distance > range) {
                    no.push(weapon.name + " - lacks Range");
                    continue;
                }
                weaponArray.push(weapon); //can add hits, rolls etc 
            }


            if (weaponArray.length === 0) {
                errorMsg.push("No Weapons with LOS or Range");
                errorMsg = errorMsg.concat(no);
            }

            SetupCard(attacker.name,defender.name,attacker.faction);

            if (combatType === "Melee" && losResult.distance > 0) {
                errorMsg.push("Not in Contact");
            }

            if (errorMsg.length > 0) {
                _.each(errorMsg,error => {
                    outputCard.body.push(error);
                })
                PrintCard();
                return;
            }


            //clear a few debuffs that only lasted one activate
            if (attacker.tokenID !== state.GDF3.activeID) {
                _.each(defenders,defender => {
                    let list = ["piercing"]
                    _.each(list,tip => {
                        RemoveTTip(defender,tip);
                    })
                })
            }





            //run through weapons, roll to hit/save any hits
            let quality = attacker.quality;







            let weaponHits = [];
            let weaponMiss = [];
    log(weaponArray)
            _.each(weaponArray,weapon => {
                let weaponOut;
                let rolls = [], hits = 0, crits = 0
                let relentless = 0,surge = 0, furious = 0,predator = 0,butcher = 0;
                let notes = [];
                let needed = quality; 
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
                    cover = losResult.targetHexCover;
                } else {
                    cover = Math.max(losResult.targetHexCover,losResult.interveningCover);
                }

                if (cover > 0) {
                    for (let i=0;i<weapon.keywords.length; i++) {
                        for (let j=0;j<ignoreCover.length;j++) {
                            if (weapon.keywords[i].includes(ignoreCover[j])) {
                                cover = 0;
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
                if (attacker.tokenID === state.GDF3.activeID && combatType === "Melee" && weapon.keywords.includes("Thrust")) {
                    weapon.ap++;
                    notes.push("Thrust");
                    needed -= 1;
                    neededTip += "<br>Thrust/Charge +1 to Hit";
                }
                if (attacker.keywords.includes("Precise")) {
                    needed -= 1;
                    neededTip += "<br>Precise +1 to Hit";
                }
                if (attacker.keywords.includes("Targeting Visor") && attacker.keywords.includes("Targeting Visor Boost") === false && losResult.distance > 4) {
                    needed -= 1;
                    neededTip += "<br>Targeting Visor +1 to Hit";
                }
                if ((attacker.keywords.includes("Targeting Visor Boost") || attackerAuras.includes("Targeting Visor Boost")) && combatType === "Ranged") {
                    needed -= 1;
                    neededTip += "<br>Targeting Visor Boost +1 to Hit";
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
                    if (cover > 0 && weapon.type !== "CCW") {
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



                if (attacker.models > 1) {
                    let ratio = attacker.Models()/attacker.models;
                    if (ratio <= 1/3) {
                        needed += 2;
                        neededTip += "<br>Heavy Casualties -2 to Hit";
                    } else if (ratio > 1/3 && ratio <= 2/3) {
                        needed += 1;
                        neededTip += "<br>Casualties -1 to Hit";
                    }
                } else if (attacker.models === 1 && attacker.type !== "Hero" && attacker.token.get(SM.halfStr)) {   
                    needed++;
                    neededTip += "<br>Damaged -1 to Hit";
                }







                needed = Math.min(6,Math.max(2,needed)); //1 is always a miss, 6 a hit

                let dice = weapon.number * weapon.attacks;


    ///? may be different if weapons have counter


                if (weapon.name === "Impact" && defender.keywords.includes("Counter")) {
                    dice -= defender.models;
                }



                do {
                    let roll = randomInteger(6);
                    rolls.push(roll);


                    if (roll >= needed) {
                        hits++;
                        if (roll === 6) {
                            crits++;
                            if ((weapon.keywords.includes("Relentless") || attackerAuras.includes("Relentless")) && losResult.distance > 4) {
                                relentless++;
                            }
                            if (weapon.keywords.includes("Surge")) {
                                surge++;
                            }
                            if (attacker.keywords.includes("Furious") || attackerAuras.includes("Furious")) {
                                furious++;
                            }
                            if (attacker.keywords.includes("Predator Fighter")) {
                                predator++;
                                let roll = randomInteger(6);
                                rolls.push(roll);
                                if (roll >= needed) {
                                    hits++;
                                }
                            }
                            if (weapon.keywords.includes("Butcher")) {
                                butcher++;
                            }


                        }
                        
                    } else {
                        //misses hit terrain here
                    }
                    
                    dice--;
                } while (dice > 0);

                if (predator > 0) {
                    s = (predator === 1) ? "":"s";
                    hitTips += "<br<Predator Fighter added " + predator + " Attack" + s;
                }
                if (butcher > 0) {
                    s = (butcher === 1) ? "":"s";
                    hitTips += "<br<Butcher added " + butcher + " hit" + s;
                }

                if (furious > 0) {
                    hits += furious;
                    s = (furious === 1) ? "":"s";
                    hitTip += "<br>Furious added " + furious + " hit" + s;
                }
                if (relentless > 0) {
                    hits += relentless;
                    s = (relentless === 1) ? "":"s";
                    hitTip += "<br>Relentless added " + relentless + " hit" + s;
                }
                if (surge > 0) {
                    hits += surge;
                    s = (surge === 1) ? "":"s";
                    hitTip += "<br>Surge added " + surge + " hit" + s;
                }



                if (blast > 0 && hits > 0) {
                    let blastHits = Math.min(defenderModels,blast);
                    if (blastHits > 1) {
                        //if 1 model, blast does no extra hits
                        hitTip += "<br>Blast adds " + ((blastHits-1) * hits) + " hits"
                        hits *= blastHits;
                    }

                }

                rolls = rolls.sort((a,b)=>b-a);
                hitTip = "Rolls: " + rolls.toString() + " vs. " + needed + "+" + neededTip + hitTip;
                let noun = (weapon.number === 1) ? " Misses":" Miss"
                if (hits > 0) {
                    let s = (hits === 1) ? "":"s";
                    tip = '[' + hits + '](#" class="showtip" title="' + hitTip + ')';
                    weaponOut = tip + ' hit' + s + ' with ' + weapon.name ;
                    let info = {
                        hitOut: weaponOut,
                        weapon: weapon,
                        crits: crits,
                        hits: hits,
                        cover: cover,
                        notes: notes,
                    }
                    weaponHits.push(info);
                } else {
                    tip = '[' + noun + '](#" class="showtip" title="' + hitTip + ')';
                    outputCard.body.push(weapon.name + tip);
                }



                if (weapon.keywords.includes("Limited")) {
                    SetTT2(attacker,"Fired " + weapon.name);
                }
                



            })
log("Weapon Hits")
log(weaponHits)
            let active = true;
            if (weaponHits.length > 0) {
                let results = ApplyDamage(weaponHits,defenders,attacker);
                totalWounds = results.totalWounds;
                active = results.active;
                if (weaponHits.length > 1) {
                    outputCard.body.push("[hr]");
                    outputCard.body.push("Total Wounds Inflicted: " + totalWounds);
                }
            }

            if (active === true) {
                if (combatType === "Melee") {
                    let cr = totalWounds;
                    let fear = attacker.keywords.find((e) => e.includes("Fear")) || "0";
                    fear = parseInt(fear.replace(/\D/g,''));
                    if (fear > 0) {
                        outputCard.body.push("Add " + fear + " for Combat Resolution for Fear");
                        cr += fear;
                    }

                    outputCard.body.push("Melee CR: " + cr);
                } else if (weaponHits.length > 0) {
                    //check for morale
                    let current = 0;
                    let total = 0;
                    _.each(defenders,defender => {
                        current += parseInt(defender.token.get("bar1_value")) || 0;
                        total += parseInt(defender.woundsMax);
                    })
                    if ((current/total) <= 0.5) {
                        outputCard.body.push("Defenders take a Morale Test");
                        let action = "!Morale;" + defender.tokenID;
                        ButtonInfo("Morale Check",action);

                    }


                }
            } else if (active === false && combatType === "Melee") {
                outputCard.body.push("[hr]");
                outputCard.body.push(attacker.name + " can make a Consolidation Move of 2 hexes");
            }

            //misses vs terrain





            if (attacker.type !== "Aircraft") {
                let angle = attackerHex.cube.angle(defenderHex.cube);
                attacker.token.set('rotation',angle);
            }



            //fatigue and melee flag
            if (combatType === "Melee") {
                attacker.token.set(SM.fatigue,true);
                attacker.melee = true;
                _.each(defenders,defender => {
                    if (defender) {
                        defender.melee = true;
                    }
                })
            } else {
                attacker.fired = true;
                attacker.melee = false;
                _.each(defenders,defender => {
                    if (defender) {
                        defender.melee = false;
                    }
                })
            }


            

        






        PrintCard();

    }









    const ClearMarkers = () => {
        //persists turn to turn
        let persistantTT = ["Steadfast Buff","Versatile Attack = +1 AP","Versatile Attack = +1 to Hit", "Versatile Defense = +1 to Defense","Versatile Defense = -1 to Be Hit",];




        //reset fatigue, activation, tooltips
        _.each(UnitArray,unit => {
            if (!unit.token) {return};
            if (unit.name.includes("Objective")) {return};
            unit.moved = false; 
            let tt = unit.TTip();
            let persistant = tt.filter((e) => persistantTT.includes(e));
            let limited = tt.filter((e) => e.includes("Fired "));
            persistant = persistant.concat(limited);
            persistant = persistant.toString();
            unit.token.set("tooltip",persistant);
            unit.token.set(SM.fatigue,false);
            unit.token.set("aura1_color","#00ff00");
            if (unit.type === "Hero") {
                toFront(unit.token);
            }
        })


    }


    const SetupGame = (msg) => {
        let Tag = msg.content.split(";");
        let deployment = Tag[1];
        let mission = Tag[2];
        SetupCard("Game Info","","Neutral");
        RemoveLines(["Deploy","LOS"]);
        outputCard.body.push("[hr]");
        outputCard.body.push("[B]Deployment Info[/b]");
        DeploymentZones(deployment);
        outputCard.body.push("[hr]");
        outputCard.body.push("[B]Mission Info[/b]");
        MissionInfo(mission);  
        PrintCard();
    }



    const Morale = (msg) => {
        let Tag = msg.content.split(";");
        let unit = UnitArray[Tag[1]];
        if (!unit) {return};
        unit.Morale();
    }




    const Activate = (msg) => {
        let Tag = msg.content.split(";");
        let id = Tag[1];
        let order = Tag[2];
        let unit = UnitArray[id];
        if (!unit) {return};
        if (unit.token.get("aura1_color") === "#000000") {
            SetupCard(unit.name,"Change Order ?",unit.faction);
            outputCard.body.push("Unit has Activated already, ?Redo")
            ButtonInfo("Redo Order","!RedoOrder;" + unit.id + ";" + order);
            PrintCard();
        } else {
            ActivateTwo(unit,order);
        }
    }

    const ActivateTwo = (unit,order) => {
        SetupCard(unit.name,order,unit.faction);
        let unitAuras = unit.Auras();
        let unitTT = unit.TTip();
        let addBreak = false;
        let ignoreDifficult = false;
        let shaken = (unit.token.get("tint_color") === "#ff0000") ? true:false;
        RemoveDead();
        state.Epic.activeID = unit.id;

        if ((unit.keywords.includes("Bounding") || unitAuras.includes("Bounding")) && order !== "Rally") {
            let roll = random(2);
            outputCard.body.push("The Unit may immediately be placed anywhere within " + roll + " Hexes")
        }

        outputCard.subtitle = order;
        unit.token.set("aura1_color","#000000");

unit.prevHexLabel = unit.hexLabel; //change this to be set at start of turn

        let move = 3;
        if (unit.keywords.includes("Fast")) {
            addBreak = true;
            move++
            outputCard.body.push("Unit has Fast and has +1 to Move");
        };
        if (unit.keywords.includes("Very Fast")) {
            addBreak = true;
            move += 2
            outputCard.body.push("Unit has Very Fast and has +2 to Move");
        }
        if (unit.keywords.includes("Slow")) {
            addBreak = true;
            move--;
            outputCard.body.push("Unit has Slow and has -1 to Move");
        }

    //other modifiers

        let charge = move * 2;
        let rush = move * 2;

        if (unit.keywords.includes("Agile") && order === "Charge/Rush") {
            charge += 1, rush+= 1;
            addBreak = true;
            outputCard.body.push("Unit has Agile gets +1 Hex to Charge/Rush");
        }
        if ((unit.keywords.includes("Rapid Charge") || unitAuras.includes("Rapid Charge") && order === "Charge/Rush")) {
            addBreak = true;
            outputCard.body.push("Unit has Rapid Charge gets +2 Hexes to Charge");
            charge += 2;
        }
        if ((unit.keywords.includes("Rapid Rush") || unitAuras.includes("Rapid Rush")) && order === "Charge/Rush") {
            addBreak = true;
            outputCard.body.push("Unit has Rapid Rush and gets +3 Hexes to Rush");
            rush += 3;
        }

        if (unit.keywords.includes("Strider") && order !== "Hold" && order !== "Rally") {
            addBreak = true;
            outputCard.body.push("Unit has Strider and may ignore the effects of Difficult Terrain");
            ignoreDifficult = true;
        }
        if ((unit.keywords.includes("Flying") || unit.keywords.includes("Fly")) && order !== "Hold" && order !== "Rally") {
            addBreak = true;
            outputCard.body.push("Unit has Flying and may Ignore Terrain and Units while Moving");
            ignoreDifficult = true;
        }
        if (unit.type === "Aircraft") {
            addBreak = true;
            ignoreDifficult = true;
            outputCard.body.push("Unit is an Aircraft and Ignores Units and Terrain");
        }

        if (addBreak === true) {
            outputCard.body.push("[hr]");
        }


        let difMove = (ignoreDifficult === false) ? Math.min(move,3):move;
        let difCharge = (ignoreDifficult === false) ? Math.min(charge, 3): charge;
        let difRush = (ignoreDifficult === false) ? Math.min(rush,3): rush;

        let startHex = HexMap[unit.hexLabel];

        if (unit.type === "Aircraft") {
            move = "15-18";
            difMove = move;
        }

        let situation = 1; //open
        if (startHex.type === "Difficult" && ignoreDifficult === false) {situation = 2}; //difficult but not building
        if (startHex.building === true) {situation = 3}; //building


        switch(order) {
            case 'Hold':
                outputCard.body.push("Unit stays in Place and may Fire");
                break;
            case 'Advance':
                if (situation === 1) { //open
                    outputCard.body.push("Advance is " + move + " Hexes");
                    if (difMove !== move) {
                        outputCard.body.push("Entering or Crossing Difficult Terrain limits Advance to " + difMove + " Hexes");
                    }
                }
                if (situation === 2) { //difficult
                    outputCard.body.push("Unit starts in Difficult Ground");
                    outputCard.body.push("Advance is " + difMove + " Hexes");
                }
                if (situation === 3) {
                    outputCard.body.push("Unit starts in a Building");
                    outputCard.body.push("Advance is " + difMove + " Hexes, to a maximum of 3 Hexes from any part of the Building");
                }
                break;
            case 'Charge/Rush':
                if (situation === 1) {
                    if (charge === rush) {
                        outputCard.body.push("Charge/Rush is " + charge + " Hexes");
                    } else {
                        outputCard.body.push("Charge is " + charge + " Hexes, Rush is " + rush + " Hexes");
                    }
                    if (difMove !== move) {
                        if (charge === rush) {
                            outputCard.body.push("Entering or Crossing Difficult Terrain limits Charge/Rush to " + difCharge + " Hexes");
                        } else {
                            outputCard.body.push("Entering/Crossing Difficult Terrain limits Charge to " + difCharge + " Hexes and Rush to " + difRush + " Hexes");
                        }
                    }
                }
                if (situation === 2) {
                    outputCard.body.push("Unit starts in Difficult Ground");
                    if (difCharge !== difRush) {
                        outputCard.body.push("Charge is " + difCharge + " Hexes");
                        outputCard.body.push("Rush is " + difRush + " Hexes");
                    } else {
                        outputCard.body.push("Charge/Rush is " + difCharge + " Hexes");
                    }
                }
                if (situation === 3) {
                    outputCard.body.push("Unit starts in a Building");
                    if (difCharge !== difRush) {
                        outputCard.body.push("Charge is " + difCharge + " Hexes");
                        outputCard.body.push("Rush is " + difRush + " Hexes");
                    } else {
                        outputCard.body.push("Charge/Rush is " + difCharge + " Hexes");
                    }
                    outputCard.body.push("To a maximum of 3 Hexes from any part of the Building");



                }

                if ((unit.keywords.includes("Hit & Run Shooter")) || unitAuras.includes("Hit & Run Shooter")) {
                    outputCard.body.push("The Unit may move up to 2 Hexes after Shooting");
                }
                if ((unit.keywords.includes("Hit & Run Fighter")) || unitAuras.includes("Hit & Run Fighter")) {
                    outputCard.body.push("The Unit may move up to 2 Hexes after Melee");
                }
                if ((unit.keywords.includes("Hit & Run")) || unitAuras.includes("Hit & Run")) {
                    outputCard.body.push("The Unit may move up to 2 Hexes after Shooting or Melee");
                }



                break;
            case 'Rally':
                if (unit.type !== "Aircraft") {
                    outputCard.body.push("Unit Stays in Hex and Rallies");
                } else {
                    outputCard.body.push("Aircraft moves " + move + " Hexes");
                    outputCard.body.push("As the Aircraft is Rallying, it may not Fire");
                }
                unit.token.set("tint_color","transparent");
                break;
        }


        if (unit.keywords.includes("Versatile Attack") || unitAuras.includes("Versatile Attack")) {
            outputCard.body.push("Unit has Versatile Attack")
            let buttons = [];
            buttons.push({
                phrase: "Choose +1 AP",
                action: "!SetTT;" + unit.tokenID + ";vAAP",
            })
            buttons.push({
                phrase: "Choose +1 to Hit",
                action: "!SetTT;" + unit.tokenID + ";vATH",
            })
            outputCard.body.push(InlineButtons(buttons));
        }
        if (unit.keywords.includes("Versatile Defense") || unitAuras.includes("Versatile Defense")) {
            outputCard.body.push("Unit has Versatile Defense")
            let buttons = [];
            buttons.push({
                phrase: "Choose +1 Defense",
                action: "!SetTT;" + unit.tokenID + ";vDD",
            })
            buttons.push({
                phrase: "Choose -1 to Hit",
                action: "!SetTT;" + unit.tokenID + ";vDTH",
            })
            outputCard.body.push(InlineButtons(buttons));
        }

        



        PrintCard();


    }

    const RedoOrder = (msg) => {
        let Tag = msg.content.split(";");
        let id = Tag[1];
        let order = Tag[2];
        let unit = UnitArray[id];
        let prevHex = HexMap[unit.prevHexLabel];
        unit.token.set({
            left: prevHex.centre.x,
            top: prevHex.centre.y,
        })
        ActivateTwo(unit,order);
    }

    const SetTT = (msg) => {
        let Tag = msg.content.split(";");
        let id = Tag[1];
        let unit = UnitArray[id];
        if (!unit) {return};
        let tip = Tag[2];
        unit.SetTT(tip);
    }

    const Dangerous = (unit) => {
        let token = unit.token;
        if (!token) {return}
        let dice = parseInt(token.get("bar1_value")) || 1;
        let rolls = [];
        let wounds = 0;
        for (let i=0;i<dice;i++) {
            let roll = randomInteger(6);
            rolls.push(roll);
            if (roll === 1) {wounds++};
        }
        rolls = rolls.sort((a,b)=> a-b);
        let tip = "Rolls: " + rolls + "<br>Takes Wounds on Rolls of 1";
        if (wounds === 0) {wounds = "No"}; 
        unit.Damage(wounds);
        let s = (wounds === 1) ? "":"s";
        tip = '[' + wounds + '](#" class="showtip" title="' + tip + ')';
        outputCard.body.push("Unit takes " + tip + " Wound" +s);
    }

    const DangerousTest = (msg) => {
        if (!msg.selected) {
            sendChat("","Select a Unit");
            return;
        }
        let id = msg.selected[0]._id;
        let unit = UnitArray[id];
        if (unit) {
            SetupCard(unit.name,"Dangerous Terrain Test",unit.faction);
            Dangerous(unit);
            PrintCard();
        } else {
            sendChat("","Not in Unit Array")
        }

    }

    const Special = (msg) => {
        let Tag = msg.content.split(";");
        let specialName = Tag[1];
        let range = Tag[2]
        let unit = UnitArray[Tag[3]];
        let unitHex = HexMap[unit.hexLabel()];
        let targets = [];
        let errorMsg = [];
        for (let i=4;i<Tag.length;i++) {
            let target = UnitArray[Tag[i]];
            if (!target) {continue};
            let losResult = LOS(unit,target);
            if (losResult.distance > range) {
                errorMsg.push(target.name + " Is Out of Range");
            }
            if (losResult.los === false) {
                errorMsg.push(target.name + " is not in LOS");
            }
            targets.push(target);
            let associated = Associated(target);
            if (associated !== false) {
                targets.push(associated);
            }
        }


        let flavour = unit.flavours[specialName] || specialName;
        SetupCard(unit.name,flavour,unit.faction);
        if (errorMsg.length > 0) {
            _.each(errorMsg,error => {
                outputCard.body.push(error);
            })
            PrintCard();
            return;
        }




        if (specialName === "Dangerous Terrain Debuff") {
            _.each(targets,target => {
                Dangerous(target);
                FX("burst-slime",unit,target);
//squelch sound
            })
        }
        if (specialName === "Mend") {
            let roll = randomInteger(3);
            let s = (roll === 1) ? "":"s";
            targets[0].Damage(-roll);
            outputCard.body.push(targets[0].name + " is healed/repaired for " + roll + " Wound" + s);
//holy sound
        }
        if (specialName === "Piercing Shooting Mark") {
            SetTT2(targets[0],TT.piercing);
            outputCard.body.push("Piercing Shooting Mark placed on " + targets[0].name);
        }
        if (specialName === "Precision Spotter") {
            let token = targets[0].token;
            if (token) {
                let num = (token.get(SM.spotter) === false) ? 0:(parseInt(token.get(SM.spotter)) > 1) ? parseInt(token.get(SM.spotter)):0;
                num = (num === 0) ? true:num+1;
                token.set(SM.spotter,num);
//sound
            }
        }
        if (specialName === "Steadfast Buff") {
            SetTT2(targets[0],TT.steadfast);
            outputCard.body.push("Steadfast Buff placed on " + targets[0].name);
//sound
        }



        PrintCard();

    }



    const RemoveLines = (which) => {
        _.each(which,lines => {
            let array;
            if (lines === "LOS") {
                array = state.Epic.losLines;
            }
            if (lines === "Deploy") {
                array = state.Epic.deployLines;
            }
            if (array) {
                for (let i=0;i<array.length;i++) {
                    let id = array[i];
                    let path = findObjs({_type: "pathv2", id: id})[0];
                    if (path) {
                        path.remove();
                    }
                }
                array = [];
            }
        })
    }


    const DrawLine = (set,colour = "#ff0000",type = "Deploy") => {
        let a = set[0],b = set[1];
        //define centre, then a and b change into points
        let left = Math.min(a[0],b[0]);
        let bottom = Math.min(a[1],b[1]);
        let x = Math.abs(a[0] - b[0])/2 + left;
        let y = Math.abs(a[1] - b[1])/2 + bottom;
        let points = [];
        points.push([a[0] - left,a[1] - bottom]);
        points.push([b[0] - left,b[1] - bottom]);
        points = JSON.stringify(points);

        let layer = (type === "LOS") ? "foreground":"map";

        let page = getObj('page',Campaign().get('playerpageid'));
        if(page) {
            let line = createObj('pathv2',{
                layer: layer,
                pageid: page.id,
                shape: "pol",
                stroke: colour,
                stroke_width: 7,
                x: x,
                y: y,
                points: points,
            });
            if (line) {
                toFront(line);
                if (type === "LOS") {
                    state.Epic.losLines.push(line.get("id"))
                } else {
                    state.Epic.deployLines.push(line.get("id"));
                }
            }
        }
    }






    const DeploymentZones = (random = "No") => {

//set for flat hexes
        let styles = ["Frontline","Frontline","Frontline","Ground War","Ground War","Side Battle","Side Battle","Disordered","Spearhead","Opposing Forces","No Man's Land","No Man's Land","Long Haul","Long Haul","Flank Assault","Meeting Engagement"];

        let roll = (random === "Yes") ? randomInteger(styles.length) - 1:0;
        let style = styles[roll];
        let styleInfo;

        let pH = pageInfo.height;
        let pts = [];
        let hW = HexInfo.width;
        let xS = HexInfo.xSpacing;
        let hH = HexInfo.height;
        //vertical - use hex height hH
        //horizontal - is 1  * hex width + (distance - 1) * xSpacing

        switch (style) {
            case 'Frontline': 
                styleInfo = "Top or Bottom";
                pts.push([[0,6*hH],[mapEdge,6*hH]])
                pts.push([[0,pH-(6*hH)],[mapEdge,pH-(6*hH)]]);
                break;
            case 'Ground War':
                styleInfo = "Left or Right";
                pts.push([[(hW + (11*xS)),0],[(hW + (11*xS)),pH]]);
                pts.push([[mapEdge - (hW + (11*xS)),0], [mapEdge - (hW + (11*xS)),pH]])
                break;
            case 'Side Battle':
                styleInfo = "Bottom or Top Corner";
                pts.push([[0,pH - (14.5 * hH)],[(27*xS),pH]]);
                pts.push([[mapEdge - (27*xS),0],[mapEdge,14.5*hH]]);
                break;
            case 'Disordered':
                styleInfo = "Top or Bottom Corners";
                pts.push([[0,pH/2],[mapEdge/2,0]]);
                pts.push([[0,pH/2],[mapEdge/2,pH]]);
                pts.push([[mapEdge/2,0],[mapEdge,pH/2]]);
                pts.push([[mapEdge/2,pH],[mapEdge,pH/2]]);
                break;
            case 'Spearhead': 
                styleInfo = "Left or Right";
                pts.push([[0,0],[hW + (11*xS),pH/2]]);
                pts.push([[0,pH],[hW + (11*xS),pH/2]]);
                pts.push([[mapEdge - hW -(11*xS),pH/2],[mapEdge,0]]);
                pts.push([[mapEdge - hW -(11*xS),pH/2],[mapEdge,pH]]);
                break;
            case 'Opposing Forces':
                styleInfo = "Left or Right";
                pts.push([[0,pH/2],[hW + (11*xS),pH/2]]);
                pts.push([[hW + (11*xS),pH/2],[hW + (11*xS),0]]);
                pts.push([[mapEdge - hW - (11*xS),pH],[mapEdge - hW - (11*xS),pH/2]]);
                pts.push([[mapEdge - hW - (11*xS),pH/2],[mapEdge,pH/2]]);
                break;
            case "No Man's Land":
                styleInfo = "Top or Bottom";
                pts.push([[0,3*hH],[mapEdge,3*hH]])
                pts.push([[0,pH-(3*hH)],[mapEdge,pH-(3*hH)]]);
                break;
            case 'Long Haul':
                styleInfo = "Left or Right";
                pts.push([[(hW + (5*xS)),0],[(hW + (5*xS)),pH]]);
                pts.push([[mapEdge - (hW + (5*xS)),0], [mapEdge - (hW + (5*xS)),pH]])
                break;
            case 'Flank Assault':
                styleInfo = "Top or Bottom";
                pts.push([[0,pH/2],[hW + (5*xS),pH/2]]);
                pts.push([[hW + (5*xS),pH/2],[hW + (5*xS),pH - (6*hH)]]);
                pts.push([[hW + (5*xS),pH - (6*hH)],[mapEdge,pH - (6*hH)]]);
                pts.push([[0,6*hH],[mapEdge - hW - (5*xS),6*hH]]);                
                pts.push([[mapEdge - hW - (5*xS),6*hH],[mapEdge - hW - (5*xS),pH/2]]);
                pts.push([[mapEdge - hW - (5*xS),pH/2],[mapEdge,pH/2]]);
                break;
            case 'Meeting Engagement':
                styleInfo = "Top or Bottom";
                pts.push([[0,6*hH],[hW + (11*xS),6*hH]]);
                pts.push([[hW + (11*xS),6*hH],[hW + (11*xS),0]]);
                pts.push([[0,pH - (6*hH)],[hW + (11*xS),pH - (6*hH)]]);
                pts.push([[hW + (11*xS),pH - (6*hH)],[hW + (11*xS),pH]]);
                pts.push([[mapEdge - hW - (11*xS),0],[mapEdge - hW - (11*xS),6*hH]]);
                pts.push([[mapEdge - hW - (11*xS),6*hH],[mapEdge,6*hH]]);
                pts.push([[mapEdge - hW - (11*xS),pH],[mapEdge - hW - (11*xS),pH - (6*hH)]]);
                pts.push([[mapEdge - hW - (11*xS),pH - (6*hH)],[mapEdge,pH - (6*hH)]]);
                break;
        }

        _.each(pts,set => {
            DrawLine(set);
        })

        outputCard.body.push("Deployment: " + style);
        outputCard.body.push("Dice Roll, winner picks " + styleInfo + " and Deploys First");

    }

    const MissionInfo = (random = "No") => {
        let missions = ["Duel","Duel","Duel","Duel","Seize Ground","Relic Hunt","Pitched Battle","Capture and Hold"];
        let roll = (random === "Yes") ? randomInteger(missions.length) - 1 :0;
        let mission = missions[roll];
        let missionInfo,number;

        switch (mission) {
            case "Duel":
                number = randomInteger(3) + 2;
                missionInfo = "After the game ends, the player that controls the most markers wins";
                break;
            case 'Seize Ground':
                number = 4;
                missionInfo = "Divide the non-deployment area into 4 equal quarters, placing one objective at the centre of each. After the game ends, the player that controls the most markers wins";
                break;
            case 'Relic Hunt':
                number = 3;
                missionInfo = "The Objectives represent highly important Relics of some kind. If a unit seizes a Objective, remove it from the table, and it counts as being carried by the unit. If the unit is shaken or destroyed at any point, the marker is dropped within 1” (placed by the opponent). When the game ends, the player that controls most markers wins."
                break;
            case 'Pitched Battle':
                number = randomInteger(3) + 2;
                missionInfo = "At the end of EACH round, players get 1VP for each objective they control, and at the end they get an additional 1 VP if they control more markers than their opponent.";
                break;
            case 'Capture and Hold':
                number = 3;
                missionInfo = "The Objectives represent important Information or Personnel. If a unit seizes a Objective, remove it from the table, and it counts as being carried by the unit. If the unit is shaken or destroyed at any point, the marker is dropped within 1” (placed by the opponent). At the end of EACH round, players get 1VP for each objective they control, and at the end they get an additional 1 VP if they control more markers than their opponent."
                break;
        }

        outputCard.body.push("Mission: " + mission);
        outputCard.body.push("Place " + number + " Objectives");
        outputCard.body.push(missionInfo);

    }


    const SetArmies = () => {
        //resets all tokens to base levels, makes sure theyre in arrays etc
        //renames also
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });

        let names = {};

        for (let i=0;i<tokens.length;i++) {
            let token = tokens[i];
            let unit = UnitArray[token];
            let character = getObj("character", token.get("represents"));   
            let name = character.get("name");
            if (!unit) {
                unit = new Unit(token.get("id"));
    log("new Unit")
                if (!unit.faction) {
                    unit.faction === "Neutral";
                    continue;
                }
            }
            if (unit.type === "Hero") {
                let name = HeroNames(unit);
                unit.name = name;
                unit.token.set("name",name);
            } else {
                if (names[name]) {
                    names[name]++;
                    unit.name = name + " " + names[name];
                    unit.token.set("name",unit.name); 
                } else {
                    names[name] = 1;
                }
            }
            unit.token.set({
                bar1_value: unit.wounds,
                bar1_max: unit.wounds,
                showplayers_bar1: true,
                aura1_color: "#00ff00",
                aura1_radius: 0.05,
                showplayers_aura1: true,
                tooltip: "",
                show_tooltip: true,
                showplayers_tooltip: true,
                showplayers_name: true,
                statusmarkers: "",
                tint_color: "transparent",
            })
            if (unit.keywords.includes("Melee Shrouding") || unit.keywords.includes("Melee Shrouding Aura")) {
                unit.token.set({
                    aura2_color: "#ffffff",
                    aura2_radius: 2,
                    showplayers_aura2: true,
                })
            }
            AddAbilities2(unit)


        }







    }



    const HeroNames = (unit) => {
        let name = "";
        let charName = getObj("character", unit.token.get("represents")).get("name");

        let factionNames = {
            "Plague Disciples": ["Blight","Pustus","Bilegore","Cachexis","Clotticus","Colathrax","Corpulux","Poxmaw","Dragan","Festardius","Fethius","Fugaris","Gangrous","Rotheart","Glauw","Leprus","Kholerus","Malarrus","Necrosius","Phage"],
            "Dao Union": ["Shi'ur","Por'o","Kai","Vor","Shi","Ru","Ni","Chi-Ha","Tor-lak"],
            "Alien Hives": ["Swarmlord","Deathleaper","Old One-Eye","The Doom of Vasta","Razor"],
        }

        if (state.Epic.heroes[unit.player].length === 0) {
            _.each(factionNames[unit.faction], name => {
                state.Epic.heroes[unit.player].push(name);
            })
        } 

log(state.Epic.heroes)

        if (charName.includes("Champion")) {name = "Champion "};
        if (charName.includes("Lord")) {name = "Lord "};
        if (unit.faction === "Dao Union") {name = "Commander "};
        if (unit.keywords.includes("Ethereal Elder")) {name = "Ethereal "};
        if (charName.includes("Captain")) {name = "Captain "};

        let number = state.Epic.heroes[unit.player].length - 1; //0 ordered array
        let factionName = "Unknown"
        if (number > 0) {
            let pos = randomInteger(number);
            factionName = state.Epic.heroes[unit.player][pos];
            state.Epic.heroes[unit.player].splice(pos,1);
        }
        name += factionName;

log(state.Epic.heroes)

        return name;
    }




    const TokenInfo = (msg) => {
        let Tag = msg.content.split(";");
        let id = Tag[1];
        let unit = UnitArray[id];
        if (!unit) {return};
log(unit)
        let label = unit.hexLabel;
        let hex = HexMap[label];

log(hex)
        SetupCard(unit.name,"Info",unit.faction);
        outputCard.body.push("Hex Label: " + label);
        outputCard.body.push("Terrain: " + hex.terrain);
        outputCard.body.push("Elevation: " + hex.elevation);
        outputCard.body.push("Terrain Height: " + hex.terrainHeight);
        outputCard.body.push("Cover: " + hex.cover);
        outputCard.body.push("Blocks LOS: " + hex.blockLOS);
        outputCard.body.push("Movement: " + hex.type);
        PrintCard();
    }

    const RollDice = (msg) => {
        PlaySound("Dice");
        let roll = randomInteger(6);
        let playerID = msg.playerid;
log(playerID);
        let id,unit,player;
        if (msg.selected) {
            id = msg.selected[0]._id;
        }
        let faction = "Neutral";

        if (!id && !playerID) {
            log("Back")
            return;
        }
        if (id) {
            unit = UnitArray[id];
            if (unit) {
                faction = unit.faction;
                player = unit.player;
            }
        }
        if ((!id || !unit) && playerID) {
            faction = state.Epic.players[playerID];
            player = (state.Epic.factions[0] === faction) ? 0:1;
        }

        if (!state.Epic.players[playerID] || state.Epic.players[playerID] === undefined) {
            if (faction !== "Neutral") {    
                state.Epic.players[playerID] = faction;
            } else {
                sendChat("","Click on one of your tokens then select Roll again");
                return;
            }
        } 
        let res = "/direct " + DisplayDice(roll,faction,40);
        sendChat("player|" + playerID,res);
    }





    const ClearState = (msg) => {
        let Tag = msg.content.split(";");
        let tokens;

        LoadPage();
        BuildMap();
        RemoveLines(["Deploy","LOS"]);
        RemoveDead();
        if (Tag[1] === "All") {
            tokens = findObjs({
                _pageid: Campaign().get("playerpageid"),
                _type: "graphic",
                _subtype: "token",
                layer: "objects",
            });
            _.each(tokens,token => token.remove());
            tokens = findObjs({
                _pageid: Campaign().get("playerpageid"),
                _type: "graphic",
                _subtype: "token",
                layer: "foreground",
            });
            _.each(tokens,token => token.remove());
        }


        //clear arrays
        UnitArray = {};

        state.Epic = {
            playerIDs: [],
            factions: [],
            turn: 0,
            activeID: "",
            deployLines: [],
            losLines: [],
            heroes: [[],[]],
        }

        sendChat("","Cleared State/Arrays");
    }



    const RemoveDepLines = () => {
        for (let i=0;i<state.Epic.deployLines.length;i++) {
            let id = state.Epic.deployLines[i];
            let path = findObjs({_type: "path", id: id})[0];
            if (path) {
                path.remove();
            }
        }
    }

    const RemoveDead = () => {
        let tokens = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
        _.each(tokens,token => {
            if (token.get("status_dead") === true) {
                token.remove();
            }
        })
    }



    //line line collision where line1 is pt1 and 2, line2 is pt 3 and 4
    const lineLine = (pt1,pt2,pt3,pt4) => {
        //calculate the direction of the lines
        uA = ( ((pt4.x-pt3.x)*(pt1.y-pt3.y)) - ((pt4.y-pt3.y)*(pt1.x-pt3.x)) ) / ( ((pt4.y-pt3.y)*(pt2.x-pt1.x)) - ((pt4.x-pt3.x)*(pt2.y-pt1.y)) );
        uB = ( ((pt2.x-pt1.x)*(pt1.y-pt3.y)) - ((pt2.y-pt1.y)*(pt1.x-pt3.x)) ) / ( ((pt4.y-pt3.y)*(pt2.x-pt1.x)) - ((pt4.x-pt3.x)*(pt2.y-pt1.y)) );
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            intersection = {
                x: (pt1.x + (uA * (pt2.x-pt1.x))),
                y: (pt1.y + (uA * (pt2.y-pt1.y)))
            }
            return intersection;
        }
        return;
    }
   




    const CheckLOS = (msg) => {
        let Tag = msg.content.split(";");
        let shooter = UnitArray[Tag[1]];
        let target = UnitArray[Tag[2]];
        let targetHex = HexMap[target.label];

        if (!shooter) {
            sendChat("","Not valid shooter");
            return;
        }
        if (!target) {
            sendChat("","Not valid target");
            return;
        }
        SetupCard(shooter.name,"LOS",shooter.faction);

        let losResult = LOS(shooter,target);
        outputCard.body.push("Distance: " + losResult.distance + " Hexes");
        if (losResult.los === false) {
            outputCard.body.push("No LOS to Target");
            outputCard.body.push(losResult.losReason);
        } else {
            outputCard.body.push("There is LOS to Target");
            if (losResult.cover === true) {
                outputCard.body.push("Target Has Cover");
            }
            if (losResult.building === true) {
                outputCard.body.push("Target in Building");
            }
        }
        
        PrintCard();
    }


    const LOS = (shooter,target) => {
        let shooterHex = HexMap[shooter.hexLabel];
        let targetHex = HexMap[target.hexLabel];
        let distance = targetHex.cube.distance(shooterHex.cube);
        let finalLOS = true;
        let finalCover = false;
        let finalLOSReason = "";
 
        let interCubes = [shooterHex.cube.linedraw(targetHex.cube),shooterHex.cube.linedraw2(targetHex.cube)];
        let labels = [interCubes[0].map((e)=> e.label()), interCubes[1].map((e)=> e.label())];

        let len = labels[0].length;
        let los = [true,true];
        let cover = [false,false];
        let losReason = ["",""];
        for (let side=0;side<2;side++) {
            for (let i=0;i<len;i++) {
                let interHex = HexMap[labels[side][i]];
                let lastHex = shooterHex;
                if (i>0) {
                    lastHex = HexMap[labels[side][i-1]];
                }
                //does hex block LOS (unless is targetHex)
                if (interHex.blockLOS === true && i<(len-1)) {
                    los[side] = false;
                    losReason[side] = interHex.terrain;
                    break;
                }
                //does edge at end give cover
                if (i === (len-1)) {
                    let dir = lastHex.cube.whatDirection(interHex.cube);
                    let edge = lastHex.edges[dir];
                    if (edge !== "Open") {
                        cover[side] = true;
                    }
                }
            }
        }

        if (los[0] === false && los[1] === false) {
            finalLOS = false;
            finalLOSReason = losReason[0];
            if (losReason[0] !== losReason[1]) {
                finalLOSReason += " / " + losReason[1];
            }
            finalLOSReason = "Blocked by " + finalLOSReason;
        }
        if (los[0] === true && los[1] === true) {
            if (cover[0] === true || cover[1] === true) {
                finalCover = true;
            }
        }
        if (los[0] === true && los[1] === false) {
            finalCover = cover[0];
        }
        if (los[0] === false && los[1] === true) {
            finalCover = cover[1];
        }

        if (targetHex.cover === true) {
            finalCover = true;
        }
        if (targetHex.cover === "Infantry" && target.type === "Infantry") {
            finalCover = true;
        }



        let result = {
            los: finalLOS,
            losReason: finalLOSReason,
            distance: distance,
            cover: finalCover,
            building: targetHex.building,
        }

        return result;
    }


    const ErrorMsg = (msgs) => {
        if (msgs.length === 0) {return false};
        _.each(msgs,msg => {
            outputCard.body.push(msg);
        })
        PrintCard();
        return true;
    }





    const changeGraphic = (tok,prev) => {
        let unit = UnitArray[tok.id];
        let newLabel = new Point(tok.get("left"),tok.get("top")).toCube().label();
        let prevLabel = new Point(prev.left,prev.top).toCube().label();
        if (newLabel !== prevLabel && unit) {
            log(unit.name + " is Moving");
            unit.hexLabel = newLabel;
            let newHex = HexMap[newLabel];
            let prevHex = HexMap[prevLabel];
            let index = prevHex.tokenIDs.indexOf(tok.id);
            if (index > -1) {
                prevHex.tokenIDs.splice(index,1);
            }
            if (newHex.tokenIDs.includes(tok.id) === false) {
                newHex.tokenIDs.push(tok.id);
            }

        }


    }
    
    const destroyGraphic = (obj) => {



    }






    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }
        let args = msg.content.split(";");
        log(args);
    
        switch(args[0]) {
            case '!Dump':
                log(HexMap)
                log("State");
                log(state.Epic);
                log("Units");
                log(UnitArray)
                break;
            case '!ClearState':
                ClearState(msg);
                break;
            case '!AddAbilities':
                AddAbilities(msg);
                break;

            case '!Activate':
                Activate(msg);
                break;
            case '!RedoOrder':
                RedoOrder(msg);
                break;

            case '!Morale':
                Morale(msg);
                break;





            case '!NextTurn':
                NextTurn();
                break;
            case '!DangerousTest':
                DangerousTest(msg);
                break;
            case '!Special':
                Special(msg);
                break;
            case '!SetArmies':
                SetArmies();
                break;
            case '!SetupGame':
                SetupGame(msg);
                break;

            case '!TokenInfo':
                TokenInfo(msg);
                break;
            case '!CheckLOS':
                CheckLOS(msg);
                break;

            case '!Roll':
                RollDice(msg);
                break;
            case '!SetTT':
                SetTT(msg);
                break;

        }
    };

   



    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        //on("add:graphic", addGraphic);
        on('change:graphic',changeGraphic);
        on('destroy:graphic',destroyGraphic);
    };
    on('ready', () => {
        log("===>Epic Grim Dark Future<===");
        log("===> Software Version: " + version + " <===")
        LoadPage();
        DefineHexInfo();
        BuildMap();
        registerEventHandlers();
        sendChat("","API Ready at " + new Date().toLocaleTimeString("en-US", {timeZone: "America/Toronto"}) + " EST");
        log("On Ready Done")
    });
    return {
        // Public interface here
    };






})();


