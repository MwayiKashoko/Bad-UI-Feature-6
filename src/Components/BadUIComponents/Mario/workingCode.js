import {
    graphics,
    width,
    height,
    shiftWidth,
    newWidth,
    game,
    pathname,
} from "./Mario";

import { random } from "./otherFunctions";
import { Game } from "./collection";
import { setIsAbleToAuthenticate } from "../../Scripts/BadUIScripts";

import {
    Player,
    Block,
    Background,
    Enemy,
    Powerup,
    Projectile
} from "./Super_Mario_Bros_Functions";

export const gameEngine = (canvas) => {
    graphics.shadowBlur = 0;
    graphics.shadowOffsetX = 0;
    graphics.shadowOffsetY = 0;

    const standardWidth = 40;
    const standardHeight = 40;

    //let state = "title screen";
    let state = "loading";
    let timeUntilPlay = 150;
    let canUpdate = true;
    let time = 0;
    let score = 0;
    let gameTime = 400;
    let powerups = [];
    let fireballs = [];
    let timeUntilNextFireball = 0;
    let fireballsThrown = 0;
    let flames = [];
    let timeUntilNextFlame = 0;
    let movingScreen = false;
    let isStanding = true;
    let isHittingLeft = false;
    let isHittingRight = false;
    let canGoToNextLevel = false;
    let timeUntilNextFish = 0;
    let world = 1;
    let stage = 1;
    let level = `${world}-${stage}`;
    let debris = [];
    let fireworks = [];
    let shift = 0;
    let quit = false;

    let currentGame = new Game();

    let gravity = currentGame.gravity;
    let music = currentGame.music;
    let sounds = currentGame.sounds;
    let levels = currentGame.levels;
    let currentLocation = levels[level].areas[0];
    let mario = currentGame.mario;
    let randomized = false;
    let codeUsed = false;

    let memory;
    let code;

    let a = 0;
    let b = 0;

    let currentBackground = "Overworld";

    const blockObject = {
        " ": "Air",
        "f": "Flagpole",
        "q": "QuestionBlock",
        "p": "QuestionBlock",
        "r": "QuestionBlock",
        "b": "Brick",
        "0": "Brick",
        "*": "Brick",
        "s": "SpecialBlock",
        "1": "Hidden Block",
        "&": "Hidden Block",
        "c": "Coin",
        "{": "TopLeftPipe",
        "}": "TopRightPipe",
        "/": "LowerLeftPipe",
        "|": "LowerRightPipe",
        "g": "Ground",
        "+": "SidewaysPipeUpperMiddle",
        "-": "SidewaysPipeUpperRight",
        "=": "SidewaysPipeLowerMiddle",
        "_": "SidewaysPipeLowerRight",
        ".": "Castle",
        ",": "BigCastle",
        "a": "Axe",
        "n": "CannonBottom",
        "w": "CannonMiddle",
        "e": "CannonTop",
        "y": "FullRedSpring",
        "u": "LavaTop",
        "i": "Lava",
        "o": "ShortMovingPlatform",
        "m": "MiddleMovingPlatform",
        "?": "LongMovingPlatform",
        "¿": "LongMovingPlatform",
        "@": "LongMovingPlatform",
        "#": "LongMovingPlatform",
        "d": "MushroomLeft",
        "h": "MushroomMiddle",
        "j": "MushroomRight",
        "k": "MushroomTop",
        ":": "MushroomBottom",
        "z": "Water",
        "x": "WaterTop",
        "~": "Princess",
        "!": "Toad",
        "(": "Brick",
        ")": "Brick",
        "$": "OverworldEmptyBlock",
        "%": "OverworldEmptyBlock",
        "<": "BowserBridge",
        "£": "TowerWall",
        "¢": "TowerTerrace",
        "∞": "CastleGround",
        "t": "Hidden Block",
        "l": "Brick",
        "2": "Brick",
        "3": "LongMovingPlatform",
        "4": "Vine1",
        "5": "Vine2",
        ">": "BridgeSupport",
        "¡": "Bridge",
        "™": "Coral",
        "§": "MiddleMovingPlatform",
        "¶": "MiddleMovingPlatform",
        "•": "CloudLeft",
        "ª": "CloudMiddle",
        "º": "CloudRight",
        "œ": "MiddleMovingPlatform",
        "∑": "OverworldEmptyBlock",
        "®": "Hidden Block",
        "†": "FullGreenSpring",
        "¥": "MiddleMovingPlatform"
    };

    const containsObject = {
        "q": "coin",
        "(": "powerup",
        ")": "1up",
        "p": "powerup",
        "1": "1up",
        "&": "coin",
        "0": "10 coins",
        "*": "Star",
        "r": "PoisonMushroom",
        "t": "PoisonMushroom",
        "l": "PoisonMushroom",
        "2": "Vine",
        "®": "powerup"
    }

    const directionObject = {
        "?": "down",
        "¿": "up",
        "@": "cyclic1",
        "#": "cyclic2",
        "m": "cyclic2",
        "3": "drop",
        "¶": "drop",
        "o": "drop",
        "§": "down",
        "œ": "right",
        "¥": "cyclic1"
    }

    let blocksImages = [];

    for (const key in blockObject) {
        blocksImages.push(
            {
                "width": standardWidth,
                "height": standardHeight,
                "letter": key,
                "img": new Image(),
                "containsImage": new Image(),
                "contains": null,
                "directionMoving": null,
                "terrain": null,
                "hasImage": true,
                "isAlt": false,
                "isAnimated": false,
            }
        );

        const lastIndex = blocksImages[blocksImages.length - 1];
        const currentName = blockObject[key];

        lastIndex.contains = containsObject[lastIndex.letter];
        lastIndex.directionObject = directionObject[lastIndex.letter];

        switch (lastIndex.contains) {
            case "coin":
                lastIndex.containsImage.src = `${pathname}/images/Coin1.png`;
                break;

            case "powerup":
                lastIndex.containsImage.src = `${pathname}/images/Mushroom.png`;
                break;

            case "1up":
                lastIndex.containsImage.src = `${pathname}/images/1up.png`;
                break;

            case "Star":
                lastIndex.containsImage.src = `${pathname}/images/Star3.png`;
                break;

            case "PoisonMushroom":
                lastIndex.containsImage.src = `${pathname}/images/PoisonMushroom.png`;
                break;

            case "Vine":
                lastIndex.containsImage.src = `${pathname}/images/Vine1.png`;
                break;

            default:
                break;
        }

        if (["?", "¿", "@", "#", "3", "6"].includes(lastIndex.letter)) {
            lastIndex.width = 120;
            lastIndex.height = 20;
        } else if (["m", "§", "¶", "œ", "¥"].includes(lastIndex.letter)) {
            lastIndex.width = 80;
            lastIndex.height = 20;
        } else if (lastIndex.letter == "<") {
            lastIndex.width = 520;
        } else if (["!", "~"].includes(lastIndex.letter)) {
            lastIndex.height = 60;
        } else if (lastIndex.letter == "y") {
            lastIndex.height = 80;
        } else if (lastIndex.letter == "f") {
            lastIndex.height = 420;
        } else if (lastIndex.letter == ".") {
            lastIndex.width = 200;
            lastIndex.height = 200;
        } else if (lastIndex.letter == ",") {
            lastIndex.width = 360;
            lastIndex.height = 440;
        }

        if (["1", "&", "t", "®", " "].includes(lastIndex.letter)) {
            lastIndex.hasImage = false;
            continue;
        }

        lastIndex.img.src = `${pathname}/images/${currentName}.png`;

        const altBlocks = ["QuestionBlock", "Brick", "Ground", "SpecialBlock"];

        if (altBlocks.includes(blockObject[lastIndex.letter])) {
            lastIndex.isAlt = true;
            lastIndex.terrain = currentLocation.terrain;
        }

        const animatedBlocks = ["QuestionBlock", "Coin", "Axe"];

        if (animatedBlocks.includes(blockObject[lastIndex.letter])) {
            lastIndex.isAnimated = true;
        }

        if (lastIndex.isAnimated && lastIndex.isAlt) {
            lastIndex.img.src = `${pathname}/images/${lastIndex.terrain}${currentName}1.png`;
        } else if (lastIndex.isAnimated) {
            lastIndex.img.src = `${pathname}/images/${currentName}1.png`;
        } else if (lastIndex.isAlt) {
            lastIndex.img.src = `${pathname}/images/${lastIndex.terrain}${currentName}.png`;
        }
    }

    blocksImages.sort((a, b) => {
        if (a.width == b.width) {
            return a.height - b.height;
        }

        return a.width - b.width;
    });

    let tempBlockArr = [];

    let blocksImagesPagesInt = 0;

    while (blocksImages.length) {
        if (blocksImagesPagesInt % 6 == 0) {
            tempBlockArr.push([]);
        }

        tempBlockArr[Math.floor(blocksImagesPagesInt / 6)].push(blocksImages.splice(0, 2));

        blocksImagesPagesInt++;
    }

    blocksImages = tempBlockArr;

    const enemyObject = {
        "G": "Goomba1",
        "K": "GreenKoopa1",
        "B": "Bowser1",
        "Q": "BlooperSwimming",
        "W": "BulletBill",
        "E": "BuzzyBeetle1",
        "L": "NormalLakitu",
        "P": "GreenParatroopa1",
        "F": "GreenParatroopa1",
        "I": "GreenPlant1",
        "H": "HammerBros1",
        "R": "RedKoopa1",
        "D": "RedParatroopa1",
        "T": "Podobo",
        "U": "RedPlant1",
        "S": "Spiny1",
        "O": "RedCheepCheep1"
    };

    let enemyImages = [];

    for (const key in enemyObject) {
        enemyImages.push(
            {
                "width": standardWidth,
                "height": standardHeight,
                "letter": key,
                "img": new Image()
            }
        );

        const lastIndex = enemyImages[enemyImages.length - 1];
        const currentName = enemyObject[key];

        if (currentName.indexOf("Koopa") > -1 || currentName.indexOf("Paratroopa") > -1) {
            lastIndex.height = 60;
        } else if (currentName.indexOf("Plant") > -1) {
            if (lastIndex.height > 0) {
                lastIndex.height = 60;
            }
        } else if (currentName.indexOf("Bowser") > -1) {
            lastIndex.width = 80;
            lastIndex.height = 80;
        } else if (currentName.indexOf("Lakitu") > -1) {
            lastIndex.height = 60;
        } else if (currentName.indexOf("HammerBros") > -1) {
            lastIndex.height = 60;
        }

        lastIndex.img.src = `${pathname}/images/${currentName}.png`;
    }

    enemyImages.sort((a, b) => a.height - b.height);

    let tempEnemyArr = [];

    while (enemyImages.length) {
        tempEnemyArr.push(enemyImages.splice(0, 2));
    }

    enemyImages = tempEnemyArr;

    let levelOffset = 0;

    //Logic for determining what happens when a key is pressed
    /*document.addEventListener("keydown", (key) => {
        key.preventDefault();
        if (quit) {
            return;
        }

        if (state == "game") {
            if (mario.transition == false) {
                if (key.keyCode == 37) {
                    mario.leftPressed = true;
                    mario.rightPressed = false;
                    mario.canMoveRight = true;
                } else if (key.keyCode == 38) {
                    //To prevent holding the up key to keep jumping
                    if (!key.repeat) {
                        mario.upPressed = true;

                        if (currentLocation.terrain == "Underwater") {
                            mario.isOnGround = false;
                            mario.isJumping = true;
                        }

                        if (mario.isOnGround && mario.upPressed && !mario.falling) {
                            mario.isOnGround = false;
                            mario.isJumping = true;
                        }
                    }
                } else if (key.keyCode == 39) {
                    mario.rightPressed = true;
                    mario.leftPressed = false;
                    mario.canMoveLeft = true;
                } else if (key.keyCode == 40) {
                    mario.downPressed = true;
                } else if (key.keyCode == 90) {
                    //Running key
                    mario.zPressed = true;
                } else if (key.keyCode == 88 && !key.repeat && !mario.clearedLevel) {
                    //Fireball key
                    if (mario.hasFireFlower && (fireballsThrown % 2 == 1 || timeUntilNextFireball <= 0) && !mario.isCrouching) {
                        sounds[4].currentTime = 0;
                        sounds[4].play();
                        mario.throwingFireball = true;
                        fireballsThrown++;
                        timeUntilNextFireball = 40;
                        fireballs.push(new Projectile("Fireball", mario.directionFacing == "left" ? mario.drawnX : mario.drawnX + mario.width / 2, mario.drawnY, mario.directionFacing, gravity, sounds));
                    }
                }
            }
        }
    });

    //What to do when a key is released
    document.addEventListener("keyup", (key) => {
        key.preventDefault();

        if (key.keyCode == 37) {
            mario.leftPressed = false;
        } else if (key.keyCode == 39) {
            mario.rightPressed = false;
        } else if (key.keyCode == 38) {
            mario.upPressed = false;
        } else if (key.keyCode == 40) {
            mario.downPressed = false;
        } else if (key.keyCode == 90) {
            mario.zPressed = false;
        }
    });*/

    document.addEventListener("keydown", (e) => {
        const t = e.target;

        // allow typing in inputs, textareas, contentEditable
        if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) {
            return;
        }

        // block scrolling keys only
        if ([37, 38, 39, 40, 32].includes(e.keyCode)) {
            e.preventDefault();
        }

        if (quit) return;

        if (state === "game" && !mario.transition) {
            if (e.keyCode === 37) {
                mario.leftPressed = true;
                mario.rightPressed = false;
                mario.canMoveRight = true;

            } else if (e.keyCode === 38 && !e.repeat) {
                mario.upPressed = true;

                if (currentLocation.terrain === "Underwater") {
                    mario.isOnGround = false;
                    mario.isJumping = true;
                }

                if (mario.isOnGround && !mario.falling) {
                    mario.isOnGround = false;
                    mario.isJumping = true;
                }

            } else if (e.keyCode === 39) {
                mario.rightPressed = true;
                mario.leftPressed = false;
                mario.canMoveLeft = true;

            } else if (e.keyCode === 40) {
                mario.downPressed = true;

            } else if (e.keyCode === 90) {
                mario.zPressed = true;

            } else if (e.keyCode === 88 && !e.repeat && !mario.clearedLevel) {
                if (mario.hasFireFlower && (fireballsThrown % 2 === 1 || timeUntilNextFireball <= 0) && !mario.isCrouching) {
                    sounds[4].currentTime = 0;
                    sounds[4].play();

                    mario.throwingFireball = true;
                    fireballsThrown++;
                    timeUntilNextFireball = 40;

                    fireballs.push(
                        new Projectile(
                            "Fireball",
                            mario.directionFacing === "left" ? mario.drawnX : mario.drawnX + mario.width / 2,
                            mario.drawnY,
                            mario.directionFacing,
                            gravity,
                            sounds
                        )
                    );
                }
            }
        }
    });

    document.addEventListener("keyup", (e) => {
        const t = e.target;

        if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) {
            return;
        }

        if ([37, 38, 39, 40, 32].includes(e.keyCode)) {
            e.preventDefault();
        }

        if (e.keyCode === 37) mario.leftPressed = false;
        else if (e.keyCode === 39) mario.rightPressed = false;
        else if (e.keyCode === 38) mario.upPressed = false;
        else if (e.keyCode === 40) mario.downPressed = false;
        else if (e.keyCode === 90) mario.zPressed = false;
    });

    //Allows a near unnoticable loop to be created for the music
    currentGame.music.ontimeupdate = function () {
        if (quit) {
            return;
        }

        if (game == "smb" || game == "smbtll") {
            if (music.src.indexOf(`${pathname}/sounds/BowsersCastle.wav`) > -1 && music.currentTime / music.duration > 0.985) {
                music.currentTime = 0;
                music.play();
            } else if (music.src.indexOf(`${pathname}/sounds/invincible.wav`) > -1 && music.currentTime / music.duration > 0.987) {
                music.currentTime = 0;
                music.play();
            } else if (music.src.indexOf(`${pathname}/sounds/Overworld.wav`) > -1 && music.currentTime / music.duration > .999) {
                //Nothing needs to happen it is already a perfect loop?
                music.play();
            } else if (music.src.indexOf(`${pathname}/sounds/savePrincess.wav`) > -1 && music.currentTime / music.duration > .4725) {
                music.currentTime = 0;
                music.play();
            } else if (music.src.indexOf(`${pathname}/sounds/Underground.wav`) > -1 && music.currentTime / music.duration > .99) {
                music.currentTime = 0;
                music.play();
            } else if (music.src.indexOf(`${pathname}/sounds/Underwater.wav`) > -1 && music.currentTime / music.duration > .999) {
                music.currentTime = 0;
                music.play();
            } else if (music.src.indexOf(`${pathname}/sounds/Bonus.wav`) > -1 && music.currentTime / music.duration > .997) {
                music.currentTime = 2;
                music.play();
            } else if (music.src.indexOf(`${pathname}/sounds/titleScreen.wav`) > -1 && music.currentTime / music.duration > .979) {
                music.currentTime = 0;
                music.play();
            }
        }

        //currentGame.musicLoop();
    }

    const setBackground = () => {
        if (currentLocation.terrain == "Underwater") {
            let water = new Image();
            water.src = `${pathname}/images/WaterTop.png`;

            for (let i = 0; i < 17; i++) {
                graphics.drawImage(water, i * standardWidth, standardHeight * 2, standardWidth, standardHeight);
            }

            graphics.fillStyle = "#62adff";
            graphics.fillRect(0, 120, width, height);
        }

        if (currentLocation.background != null) {
            if (canUpdate) {
                currentLocation.background.update(movingScreen, currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth, mario.velX);
            }

            currentLocation.background.draw();
        }
    }

    const setCoins = () => {
        let coinList = mario.coinAnimationList;

        for (let i = 0; i < coinList.length; i++) {
            coinList[i].img.src = `${pathname}/images/CoinSpin` + (Math.floor(time / 4 % 4) + 1) + ".png";

            if (canUpdate) {
                if (movingScreen && currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth) {
                    coinList[i].xValue -= mario.velX;
                }

                coinList[i].timeUntilDisappear++;

                if (coinList[i].timeUntilDisappear <= 25) {
                    coinList[i].yValue -= 4;
                } else {
                    coinList[i].yValue += 4;
                }

                if (coinList[i].timeUntilDisappear >= 60) {
                    coinList.splice(i, 1);
                }
            }
        }

        for (let i = 0; i < coinList.length; i++) {
            graphics.drawImage(coinList[i].img, Math.round(coinList[i].xValue), Math.round(coinList[i].yValue), standardWidth / 2, standardHeight);
        }
    }

    const setScores = () => {
        let scoreValues = mario.scoreValues;

        for (let i = 0; i < scoreValues.length; i++) {
            scoreValues[i].timer++;

            if (scoreValues[i].has1Up) {
                sounds[0].currentTime = 0;
                sounds[0].play();
                mario.lives++;
                scoreValues[i].has1Up = false;
            }

            if (canUpdate && movingScreen && currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth) {
                scoreValues[i].x -= mario.velX;
            }

            scoreValues[i].y -= 3;

            if (scoreValues[i].timer > 50) {
                scoreValues.splice(i, 1);
            }
        }

        graphics.fillStyle = "white";
        graphics.font = "25px smb";

        for (let i = 0; i < scoreValues.length; i++) {
            if (scoreValues[i].score != 50) {
                graphics.fillText(scoreValues[i].score, scoreValues[i].x + 18, scoreValues[i].y);
            }
        }
    }

    const addPowerup = (x, y, type) => {
        powerups.push(new Powerup(x, y, type, gravity, music, sounds, currentLocation.terrain));
    }

    const addEnemy = (x, y) => {
        const array = ["G", "K", "B", "Q", "W", "E", "L", "P", "F", "I", "H", "R", "D", "T", "U", "A", "S"];

        currentLocation.enemies.push(new Enemy(x, y, standardWidth, standardHeight, array[random(0, array.length - 1)], gravity, sounds, currentLocation.terrain, null))
    }

    const reset = () => {
        randomized = false;
        state = "loading";
        timeUntilPlay = 150;

        if (mario.lives == 0) {
            timeUntilPlay = 350;
        }

        if (mario.lives <= 0) {
            world = 1;
            stage = 1;
            level = "1-1";
        }

        currentLocation = levels[level].areas[0];

        levels[level].areas.forEach((areas, k, place) => {
            place[k].pair = null;

            areas.area.forEach((row, j) => {
                row.forEach((block, i, arr) => {
                    const canEnter = block.canEnter;
                    const isEdge = block.isEdge;
                    let pair = arr[i].pair;
                    let pulleyPair = arr[i].pulleyPair;
                    let connection = arr[i].connection;

                    arr[i] = new Block(block.storedType, block.constantX, block.constantY, block.constantX, block.constantY, block.constantWidth, block.constantHeight, sounds, block.terrain);

                    arr[i].canEnter = canEnter;
                    arr[i].isEdge = isEdge;
                    arr[i].pair = pair;
                    arr[i].pulleyPair = pulleyPair;

                    if (arr[i].pulleyPair != null) {
                        arr[i].pulleyPair.pulleyPair = arr[i];
                    }

                    arr[i].connection = connection;
                });
            });

            if (areas.background != null) {
                areas.background = new Background(areas.background.img.src, areas.background.constantX, areas.background.constantY, areas.background.width, areas.background.height);
            }

            if (areas.enemies != null) {
                let canResetEnemy = true;
                areas.enemies.forEach((enemy, i, arr) => {
                    if (canResetEnemy) {
                        arr[i] = new Enemy(enemy.constantX, enemy.constantY, enemy.constantWidth, enemy.constantHeight, enemy.storedType, gravity, sounds, areas.terrain, enemy.animated);
                    }

                    if (arr[i].drawnX == -1000) {
                        canResetEnemy = false;
                    }
                });

                for (let i = 0; i < areas.enemies.length; i++) {
                    if (areas.enemies[i].drawnX == -1000) {
                        areas.enemies.length = i + 1;
                        break;
                    }
                }
            }
        });

        time = 0;
        gameTime = 400;
        movingScreen = false;
        isStanding = false;
        timeUntilNextFireball = 0;
        fireballsThrown = 0;

        const startingY = mario.startingY;

        mario = new Player(mario.lives, gravity, music, sounds, mario.coins);

        mario.isBig ? mario.drawnY = 440 : mario.drawnY = 480;

        if (stage == 4) {
            mario.drawnY = 240 - (mario.height - 40);
        }

        powerups = [];
        fireballs = [];
        flames = [];
    }

    const nextLevel = () => {
        randomized = false;

        if (world == 1) {
            world = 8;
            stage = 3;
        } else if (world == 8) {
            world = "D";
            stage = 1;
        } else if (world == "D") {
            setIsAbleToAuthenticate(true);
            return true;
        }

        mario.isBig ? mario.drawnY = 440 : mario.drawnY = 480;

        if (stage == 4) {
            mario.drawnY = 240 - (mario.height - 40);
        }

        level = `${world}-${stage}`;
        currentLocation = levels[level].areas[0];

        state = "loading";
        timeUntilPlay = 150;

        canGoToNextLevel = false;

        time = 0;
        gameTime = 400;
        movingScreen = false;
        isStanding = false;
        timeUntilNextFireball = 0;
        fireballsThrown = 0;
        mario.drawnX = 80;
        mario.alignX = mario.drawnX;
        mario.velX = 0;
        mario.lastGroundY = mario.drawnY;
        mario.hasStar = false;
        mario.invincibility = 0;
        mario.isCrouching = false;
        mario.lastVelY = 0;
        mario.clearedLevel = false;
        mario.timeUntilFallFromFlagpole = 0;
        mario.isMovingOnPole = true;
        mario.canGoToCastle = false;
        mario.timeUntilGoToCastle = 0;
        mario.hasFlippedOnPole = false;
        mario.isWalkingToCastle = false;
        mario.behindCastle = false;
        mario.canClearLevel = false;
        mario.transition = false;
        mario.timeToMoveToNextLevel = 0;

        powerups = [];
        fireballs = [];
        flames = [];

        currentLocation = levels[level].areas[0];
    }

    const changeLocation = () => {
        randomized = false;
        powerups = [];
        fireballs = [];
        flames = [];

        if (mario.blockStandingOn.pair != undefined) {
            currentLocation.pair = mario.blockStandingOn.pair;
        }

        let shiftAmount = 0;

        if (game == "smb") {
            if (level == "1-1") {
                if (currentLocation == currentGame.level1_1Overworld) {
                    currentLocation = levels[level].areas[1];
                    mario.changeLocation("fall");
                } else {
                    currentLocation = levels[level].areas[0];

                    mario.changeLocation("up pipe");
                }
            }
        } else if (game == "smbtll") {
            if (level == "D-1") {
                if (currentLocation == currentGame.levelD_1Overworld) {
                    currentLocation = levels[level].areas[1];

                    mario.changeLocation("fall");
                } else {
                    currentLocation = levels[level].areas[0];

                    mario.changeLocation("up pipe");
                }
            }
        }

        mario.canClearLevel = false;

        let newX = currentLocation.pair == null ? shiftAmount : currentLocation.pair.constantX - 120;

        currentLocation.area.forEach((row, j) => {
            row.forEach((block, i, arr) => {
                const canEnter = block.canEnter;
                const isEdge = block.isEdge;
                let pair = arr[i].pair;
                let pulleyPair = arr[i].pulleyPair;
                let connection = arr[i].connection;

                arr[i] = new Block(block.storedType, block.constantX, block.constantY, block.constantX, block.constantY, block.constantWidth, block.constantHeight, sounds, block.terrain);

                arr[i].drawnX -= newX;
                arr[i].movingX -= newX;

                arr[i].fireBar.forEach((fireball, k, array) => {
                    array[k].drawnX -= newX;
                    array[k].centerX -= newX;
                });

                arr[i].canEnter = canEnter;
                arr[i].isEdge = isEdge;

                arr[i].pair = pair;
                arr[i].pulleyPair = pulleyPair;

                if (arr[i].pulleyPair != null) {
                    arr[i].pulleyPair.pulleyPair = arr[i];
                }

                arr[i].connection = connection;
            });
        });

        if (currentLocation.background != null) {
            currentLocation.background = new Background(currentLocation.background.img.src, currentLocation.background.constantX, currentLocation.background.constantY, currentLocation.background.width, currentLocation.background.height);
            currentLocation.background.drawnX -= newX;
        }

        let canResetEnemy = true;

        currentLocation.enemies.forEach((enemy, i, arr) => {
            if (canResetEnemy) {
                arr[i] = new Enemy(enemy.constantX, enemy.constantY, enemy.constantWidth, enemy.constantHeight, enemy.storedType, gravity, sounds, currentLocation.terrain, enemy.animated);
            }

            if (arr[i].drawnX == -1000) {
                canResetEnemy = false;
                currentLocation.enemies.length = i + 1;
            }
        });

        for (let i = 0; i < currentLocation.enemies.length; i++) {
            let enemy = currentLocation.enemies[i];

            if (enemy.drawnX != -1000) {
                enemy.drawnX -= newX;
                enemy.movingX -= newX;

                enemy.hitboxX -= newX;
            }
        }

        mario.keyLastPressed = "right";
        music.currentTime = 0;
        music.src = `${pathname}/sounds/${currentLocation.terrain}.wav`;
        music.play();
    }

    const goBackwards = () => {
        let newX;

        if (game == "smb" && currentLocation == currentGame.level8_4Castle) {
            timeUntilNextFish--;

            if (timeUntilNextFish <= 0) {
                timeUntilNextFish = 50;

                if (currentLocation.area[10][198].drawnX <= 120 && currentLocation.area[10][243].drawnX >= 600) {
                    currentLocation.enemies.push(new Enemy(random(100, width - shiftWidth * 4), height, standardWidth, standardHeight, "O", gravity, sounds, currentLocation.terrain, 0))
                }
            }

            if (currentLocation.area[13][113].drawnX < 600 && currentLocation.area[13][113].drawnX > 590) {
                newX = currentLocation.area[13][31].constantX;
            } else if (currentLocation.area[13][183].drawnX < 600 && currentLocation.area[13][183].drawnX > 590) {
                newX = currentLocation.area[13][96].constantX;
            } else if (currentLocation.area[10][254].drawnX < 600 && currentLocation.area[10][254].drawnX > 590) {
                newX = currentLocation.area[13][181].constantX;
            }
        }

        if (newX != undefined) {
            newX -= 320;

            currentLocation.area.forEach((row, j) => {
                row.forEach((block, i, arr) => {
                    const canEnter = block.canEnter;
                    const isEdge = block.isEdge;
                    let pair = arr[i].pair;
                    let pulleyPair = arr[i].pulleyPair;
                    let connection = arr[i].connection;

                    arr[i] = new Block(block.storedType, block.constantX, block.constantY, block.constantX, block.constantY, block.constantWidth, block.constantHeight, sounds, block.terrain);

                    arr[i].drawnX -= newX;
                    arr[i].movingX -= newX;

                    arr[i].fireBar.forEach((fireball, k, array) => {
                        array[k].drawnX -= newX;
                        array[k].centerX -= newX;
                    });

                    arr[i].canEnter = canEnter;
                    arr[i].isEdge = isEdge;

                    arr[i].pair = pair;
                    arr[i].pulleyPair = pulleyPair;

                    if (arr[i].pulleyPair != null) {
                        arr[i].pulleyPair.pulleyPair = arr[i];
                    }

                    arr[i].connection = connection;
                });
            });

            if (currentLocation.background != null) {
                currentLocation.background = new Background(currentLocation.background.img.src, currentLocation.background.constantX, currentLocation.background.constantY, currentLocation.background.width, currentLocation.background.height);
                currentLocation.background.drawnX -= newX;
            }

            let canResetEnemy = true;
            currentLocation.enemies.forEach((enemy, i, arr) => {
                if (canResetEnemy) {
                    arr[i] = new Enemy(enemy.constantX, enemy.constantY, enemy.constantWidth, enemy.constantHeight, enemy.storedType, gravity, sounds, enemy.terrain, enemy.animated);
                }

                if (arr[i].drawnX == -1000) {
                    canResetEnemy = false;
                    currentLocation.enemies.length = i + 1;
                }
            });

            for (let i = 0; i < currentLocation.enemies.length; i++) {
                let enemy = currentLocation.enemies[i];

                if (enemy.drawnX != 1000) {
                    enemy.drawnX -= newX;
                    enemy.hitboxX -= newX;
                }
            }
        }
    }


    const addDebris = (objects) => {
        for (let i = 0; i < objects.length; i++) {
            debris.push(objects[i]);
        }
    }

    const setDebris = () => {
        for (let i = 0; i < debris.length; i++) {
            debris[i].img.src = `${pathname}/images/${currentLocation.terrain != "Bonus" ? currentLocation.terrain : "Underground"}BrokenBrick${(Math.floor(time / 10)) % 4 + 1}.png`;

            if (canUpdate) {
                if (currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth) {
                    debris[i].x -= mario.velX;
                }

                debris[i].x += debris[i].velX;
                debris[i].time++;
                debris[i].y = debris[i].originalY - 2 * debris[i].time + 0.5 * gravity * debris[i].time ** 2;

                if (debris[i].y > height) {
                    debris.splice(i, 1);
                }
            }

            if (i < debris.length) {
                graphics.drawImage(debris[i].img, Math.round(debris[i].x), Math.round(debris[i].y), 20, 20)
            }
        }
    }

    const setFireworks = () => {
        if (fireworks.length > 0) {
            if (fireworks[0].existence < 1) {
                sounds[9].currentTime = 0;
                sounds[9].play();
            }

            fireworks[0].img.src = `${pathname}/images/Firework${(Math.floor(fireworks[0].existence / 10)) % 3 + 1}.png`;
            fireworks[0].existence++;

            graphics.drawImage(fireworks[0].img, fireworks[0].x, fireworks[0].y, standardWidth, standardHeight);

            if (fireworks[0].existence > 30) {
                mario.addScore(500, -100, -100);
                fireworks.shift();
            }
        }
    }

    const draw = () => {
        graphics.clearRect(0, 0, width, height);
        graphics.fillStyle = "white";

        //draws the text to the screen
        graphics.font = "25px smb";
        graphics.fillText("MARIO", 100, 30);
        graphics.fillText(("00000" + score).slice(-6), 110, 50);
        const coinImageNumber = Math.floor(time % 50 / 10) + 1;

        if (state != "loading") {
            currentGame.hudCoin.src = `${pathname}/images/hudCoin${coinImageNumber > 3 ? (coinImageNumber == 4 ? 2 : 1) : coinImageNumber}.png`;
        } else if (currentGame.hudCoin.src.indexOf(`${pathname}/images/hudCoin1.png`) == -1) {
            currentGame.hudCoin.src = `${pathname}/images/hudCoin1.png`;
        }

        graphics.drawImage(currentGame.hudCoin, 220, 32, 20, 20);
        graphics.drawImage(currentGame.xImage, 237, 32, 20, 20)
        graphics.fillText("" + ("0" + mario.coins).slice(-2), 275, 50);
        graphics.fillText("WORLD", 400, 30);
        graphics.fillText(level, 400, 50)
        graphics.fillText("TIME", 550, 30);
        graphics.fillText(("00" + gameTime).slice(-3), 555, 50);

        if (state == "loading") {
            //What to do when on the loading screen
            if (mario.lives > 0) {
                music.src = `${pathname}/sounds/${currentLocation.terrain}.wav`;

                if (currentLocation == currentGame.level1_2Overworld1) {
                    music.src = `${pathname}/sounds/overworldToUnderground.wav`
                }
            }

            if (canvas.style.background != "black") {
                canvas.style.background = "black";
            }

            if (mario.lives > 0) {
                let smallMario = new Image();
                smallMario.src = `${pathname}/images/smallMarioStanding.png`;
                graphics.fillText(`world ${level}`, width / 2 - shiftWidth, 200);
                graphics.drawImage(smallMario, width / 2 - 75 - shiftWidth, 240, standardWidth, standardHeight);
                graphics.drawImage(currentGame.xImage, width / 2 - shiftWidth, 250, 20, 20);
                graphics.fillText(mario.lives, 460 - shiftWidth, 270);
            } else {
                graphics.fillText("game over", width / 2 - shiftWidth, height / 2);
            }

            timeUntilPlay--;

            if (timeUntilPlay == 0) {
                if (mario.lives > 0) {
                    state = "game";
                }
            }
        } else if (state == "game") {
            //What to do if the actual game is running
            if (currentLocation.color != undefined) {
                canvas.style.background = currentLocation.color;
            } else {
                canvas.style.background = "black";
            }

            isHittingLeft = false;
            isHittingRight = false;

            if (mario.blockMovingOn != null) {
                mario.velX = mario.blockMovingOn.velX;
                mario.blockMovingOn = null;
            }

            score = mario.score;

            //Aligning mario at the center of the screen
            if (currentLocation.canScroll && mario.canMoveRight && mario.canMoveLeft && !mario.goingUpPipe && mario.velX > 0) {
                movingScreen = true;
            } else {
                movingScreen = false;
            }

            let possibleToNotScroll = true;

            currentLocation.area.forEach((row) => {
                row.forEach((block, i, arr) => {
                    if (block.type == "Flagpole") {
                        possibleToNotScroll = false;
                    }
                });
            });

            if (currentLocation.area[currentLocation.area.length - 1][currentLocation.area[currentLocation.area.length - 1].length - 1].drawnX <= 600 && possibleToNotScroll) {
                currentLocation.canScroll = false;

                if (game == "smb") {
                    switch (level) {
                        case "1-2":
                            if (currentLocation == currentGame.level1_2Overworld1) {
                                mario.canClearLevel = false;

                                if (!["into pipe", "pipe"].includes(mario.transition)) {
                                    mario.transition = "walkingIntoPipe";
                                }
                            } else if (currentLocation == currentGame.level1_2Underground1) {
                                graphics.fillStyle = "white";
                                graphics.fillText("Welcome to warp zone!", 280, 240);
                                graphics.fillText("8-2", 120, 340);
                                graphics.fillText("8-1", 280, 340);
                                graphics.fillText("1-4", 440, 340);

                                currentLocation.enemies.forEach((val, i, arr) => {
                                    arr[i].drawnX = -100;
                                });
                            }

                            break;
                        default:
                            break;
                    }
                }
            } else {
                currentLocation.canScroll = true;
            }

            isStanding = false;

            setBackground();

            if (mario.transition == "down pipe" || mario.transition == "into pipe" || mario.goingUpPipe) {
                mario.draw();
            }

            currentLocation.area.forEach((row, j) => {
                row.forEach((block, i, arr) => {
                    if (block.type != "Air") {
                        if (canUpdate) {
                            arr[i].update(movingScreen, currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth, mario.velX, mario.drawnX + mario.width / 2);

                            if (arr[i].bullets.length > 0) {
                                arr[i].bullets.forEach((bullet, k, bullets) => {
                                    if (currentLocation.enemies.indexOf(bullets[k]) == -1) {
                                        currentLocation.enemies.push(bullets[k]);
                                    }
                                });
                            }
                        }

                        if (block.type.indexOf("Coin") > -1) {
                            arr[i].collides(mario);
                        } else if (block.type.indexOf("Flagpole") > -1) {
                            if (mario.transition == "cleared level") {
                                if (block.offsetY + 79 + block.drawnY < 460) {
                                    block.offsetY += 5;
                                } else {
                                    mario.canGoToCastle = true;
                                }
                            }

                            if (mario.clearedLevel && fireworks.length == 0 && !mario.behindCastle) {
                                const fireworkNumber = gameTime % 10;

                                if (fireworkNumber == 1 || fireworkNumber == 3 || fireworkNumber == 6) {
                                    for (let i = 0; i < fireworkNumber; i++) {
                                        fireworks.push({
                                            x: random(320, 720),
                                            y: random(120, 200),
                                            img: new Image(),
                                            existence: 0
                                        });
                                    }
                                }
                            }
                        } else if (block.type == "Castle" || block.type == "BigCastle") {
                            if (i > 10 && block.drawnX + block.width >= 0 && block.drawnX < newWidth) {
                                mario.canClearLevel = true;
                            }

                            if (arr[i].castleCollisions(mario, gameTime, fireworks)) {
                                mario.timeToMoveToNextLevel++;

                                if (mario.timeToMoveToNextLevel >= 150) {
                                    canGoToNextLevel = true;
                                }
                            }
                        } else if (block.type == "Axe") {
                            arr[i].collides(mario);
                        } else {
                            if (!mario.goingUpPipe) {
                                if (canUpdate) {
                                    //Top collisions for mario
                                    let cantShoot = false;
                                    if ((j - 1 > 0 && !currentLocation.area[j - 1][i].hasCollisions && arr[i].topCollisions(mario))) {
                                        isStanding = true;

                                        if (block.type.indexOf("Cannon") > -1) {
                                            cantShoot = true;
                                        }
                                    }

                                    const currentBrick = arr[i];

                                    //Bottom collisions for Mario
                                    if (j + 1 < currentLocation.area.length && (!currentLocation.area[j + 1][i].hasCollisions || currentLocation.area[j + 1][i].type == "Air") && arr[i].bottomCollisions(mario, addPowerup, addEnemy)) {
                                        if (block.bumping > 0 && j - 1 >= 0 && currentLocation.area[j - 1][i].type == "Coin") {
                                            currentLocation.area[j - 1][i].type = "Air";
                                            mario.addCoin(block.drawnX + 10, block.drawnY - standardHeight);
                                            mario.coins++;
                                        }

                                        if (block.type == "Air") {
                                            addDebris([{
                                                img: new Image(),
                                                x: currentBrick.drawnX,
                                                y: currentBrick.drawnY,
                                                originalY: currentBrick.drawnY,
                                                time: 0,
                                                velX: -2,
                                            },
                                            {
                                                img: new Image(),
                                                x: currentBrick.drawnX + currentBrick.width,
                                                y: currentBrick.drawnY,
                                                originalY: currentBrick.drawnY,
                                                time: 0,
                                                velX: 2,
                                            },
                                            {
                                                img: new Image(),
                                                x: currentBrick.drawnX,
                                                y: currentBrick.drawnY + currentBrick.height,
                                                originalY: currentBrick.drawnY + currentBrick.height,
                                                time: 0,
                                                velX: -2,
                                            },
                                            {
                                                img: new Image(),
                                                x: currentBrick.drawnX + currentBrick.width,
                                                y: currentBrick.drawnY + currentBrick.height,
                                                originalY: currentBrick.drawnY + currentBrick.height,
                                                time: 0,
                                                velX: 2,
                                            }]);
                                        }
                                    }

                                    //Vine collisions
                                    (block.vineStructure != null || block.type.indexOf("Vine") > -1) && arr[i].vineCollisions(mario);

                                    //Left collisions
                                    if (!mario.clearedLevel && i - 1 > 0 && (!row[i - 1].hasCollisions || row[i - 1].type == "Air") && arr[i].leftCollisions(mario)) {
                                        isHittingLeft = true;

                                        if (block.type.indexOf("Cannon") > -1) {
                                            cantShoot = true;
                                        }
                                    }

                                    //Right collisions
                                    if (!mario.clearedLevel && i + 1 < row.length && (!row[i + 1].hasCollisions || row[i + 1].type == "Air") && arr[i].rightCollisions(mario)) {
                                        isHittingRight = true;

                                        if (block.type.indexOf("Cannon") > -1) {
                                            cantShoot = true;
                                        }
                                    }

                                    if (cantShoot) {
                                        currentLocation.area.forEach((column, k, blocks) => {
                                            blocks[k][i].timeToShootBullet = 100;
                                        });
                                    }
                                }
                            }

                            //Block collisions for enemies
                            if (currentLocation.enemies != undefined) {
                                currentLocation.enemies.forEach((enemy, k, enemies) => {
                                    enemies[k].isStanding = false;

                                    if (enemy.collisions && enemy.affectedByGravity) {
                                        if (j - 1 > 0 && (!currentLocation.area[j - 1][i].hasCollisions || currentLocation.area[j - 1][i].type == "Air") && arr[i].topCollisions(enemies[k], mario)) {
                                            enemies[k].isStanding = true;
                                        }

                                        if (i - 1 > 0 && !row[i - 1].hasCollisions && arr[i].leftCollisions(enemies[k])) {
                                            enemies[k].directionFacing = "left";
                                        } else if (i + 1 < row.length && !row[i + 1].hasCollisions && arr[i].rightCollisions(enemies[k])) {
                                            enemies[k].directionFacing = "right";
                                        }
                                    }
                                });
                            }

                            //Block collisions for powerups
                            powerups.forEach((powerup, k) => {
                                if ((i - 1 > 0 && !row[i - 1].hasCollisions && arr[i].leftCollisions(powerups[k])) || (i + 1 < row.length && !row[i + 1].hasCollisions && arr[i].rightCollisions(powerups[k]))) {
                                    powerups[k].velX *= -1;
                                }

                                if (j + 1 < currentLocation.area.length && !currentLocation.area[j + 1][i].hasCollisions && arr[i].bottomCollisions(powerups[k])) {
                                    powerups[k].hitBlock = true;
                                }

                                if (j - 1 > 0 && !currentLocation.area[j - 1][i].hasCollisions && powerups[k].risen && !arr[i].topCollisions(powerups[k])) {
                                    powerups[k].condition = true;
                                }
                            });

                            //Block collisions for fireballs
                            for (let k = 0; k < fireballs.length; k++) {
                                if ((i - 1 > 0 && !row[i - 1].hasCollisions && arr[i].leftCollisions(fireballs[k])) || (i + 1 < row.length && !row[i + 1].hasCollisions && arr[i].rightCollisions(fireballs[k])) || (j + 1 < currentLocation.area.length && !currentLocation.area[j + 1][i].hasCollisions && arr[i].bottomCollisions(fireballs[k]))) {
                                    sounds[1].currentTime = 0;
                                    sounds[1].play();
                                    fireballs.splice(k, 1);
                                    continue;
                                }

                                if (j - 1 > 0 && !currentLocation.area[j - 1][i].hasCollisions && arr[i].topCollisions(fireballs[k]));
                            }
                        }
                    } else if (movingScreen && currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth && canUpdate) {
                        arr[i].drawnX -= mario.velX;
                    }
                });
            });

            //Determines whether Mario is falling or not
            if (!isStanding && !mario.isJumping && mario.transition == false && !mario.clearedLevel && !mario.goingUpPipe && !mario.onSpring) {
                mario.falling = true;
                mario.isOnGround = false;

                if (currentLocation.terrain != "Underwater") {
                    mario.fall();
                } else {
                    mario.drawnY += 2;
                    mario.isOnGround = false;
                }
            }

            //The reason I have two of these statements is to make sure that the background is not drawn over the pit as seen in the block.draw function, and then to make sure that every block drawn is still above this air layer
            currentLocation.area.forEach((row, j) => {
                row.forEach((block, i, arr) => {
                    if (block.drawnX <= width - shiftWidth && block.drawnX + block.width >= 0 && ["Water", "Lava", "Air"].includes(block.type)) {
                        block.draw();
                    }
                });
            });

            //All enemy logic
            if (currentLocation.enemies != undefined) {
                for (let enemy of currentLocation.enemies) {
                    if (canUpdate) {
                        enemy.update(movingScreen, currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth, mario.velX, mario.drawnX, mario.drawnY + mario.height / 2, world);

                        enemy.hammers.forEach((hammer, i, hammers) => {
                            hammers[i].update(movingScreen, currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth, mario.velX, mario.drawnX, mario.velX);
                            hammers[i].collides(mario);
                        });
                    }

                    if (!enemy.gone) {
                        if (canUpdate) {
                            if (enemy.spinies.length > 0) {
                                enemy.spinies.forEach((spiny, i, arr) => {
                                    if (currentLocation.enemies.indexOf(arr[i]) == -1) {
                                        currentLocation.enemies.push(arr[i]);
                                    }
                                });
                            }
                        }

                        if (enemy.alive) {
                            if (mario.transition == false && !mario.goingUpPipe) {
                                enemy.topMarioCollisions(mario);
                                enemy.otherCollisions(mario, mario);
                            } else {
                                enemy.timeToMoveUpAndDown = 0;
                            }

                            for (let enemy2 of currentLocation.enemies) {
                                if ((enemy.collisions && enemy2.collisions) || (enemy.moving || enemy2.moving)) {
                                    enemy.otherCollisions(enemy2, mario);
                                }
                            }
                        }

                        if (enemy.type == "RedKoopa" && !enemy.inShell && enemy.drawnY == enemy.lastGroundY) {
                            let row = currentLocation.area.filter((row, i, arr) => i * standardWidth >= enemy.drawnY + enemy.height && (i + 1) * standardHeight <= enemy.drawnY + enemy.height + standardHeight);

                            if (row.length > 0) {
                                row[0].forEach((block, i, arr) => {
                                    if (!block.hasCollisions) {
                                        if (enemy.directionFacing == "left" && enemy.drawnX - block.drawnX < 20 && enemy.drawnX - block.drawnX > 0) {
                                            enemy.directionFacing = "right";
                                        } else if (enemy.directionFacing == "right" && block.drawnX - enemy.drawnX < 20 && block.drawnX - enemy.drawnX > 0) {
                                            enemy.directionFacing = "left";
                                        }
                                    }
                                });
                            }
                        }

                        if (canUpdate && !enemy.isStanding && enemy.affectedByGravity && !enemy.isFlying && !enemy.isJumping && enemy.type.indexOf("Lakitu") == -1 && enemy.type != "BlooperSwimming" && enemy.type != "Podobo") {
                            enemy.fall();
                        }

                        if (enemy.type.indexOf("Plant") > -1 && enemy.drawnX <= width - shiftWidth && enemy.drawnX + enemy.width >= 0) {
                            enemy.draw();
                        }

                        if (enemy.drawnY > height && enemy.type != "Podobo") {
                            enemy.die("stomp");
                        }
                    }
                }
            }

            currentLocation.area.forEach((row, j) => {
                row.forEach((block, i, arr) => {
                    if (block.drawnX <= width - shiftWidth && block.drawnX + block.width >= 0 && !["Water", "Lava", "Air"].includes(block.type) && block.directionMoving == null) {
                        block.draw();

                        if (mario.clearedLevel && (block.type.indexOf("Ground") > -1 || block.type.indexOf("Cloud") > -1) && block.drawnX > newWidth / 2) {
                            let ground = new Image();
                            ground.src = block.img.src;

                            for (let i = 0; i < 10; i++) {
                                graphics.drawImage(ground, block.drawnX + (i * block.width), block.drawnY, block.width, block.height);
                            }
                        }
                    }
                });
            });

            currentLocation.area.forEach((row, j) => {
                row.forEach((block, i, arr) => {
                    if (block.drawnX <= width - shiftWidth && block.drawnX + block.width >= 0 && !["Water", "Lava", "Air"].includes(block.type) && block.directionMoving != null) {
                        block.draw();
                    }
                });
            });

            setScores();

            setCoins();
            setDebris();

            fireballs.forEach((fireball, i, arr) => {
                if (canUpdate) {
                    arr[i].update(movingScreen, currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth, mario.velX);
                }

                if (fireball.drawnX <= width - shiftWidth && fireball.drawnX + fireball.width >= 0) {
                    fireball.draw();
                }

                let canBreak = false;

                if (currentLocation.enemies != undefined) {
                    currentLocation.enemies.forEach((val, j, enemies) => {
                        if (arr[i].collides(enemies[j], mario)) {
                            canBreak = true;
                            return;
                        }
                    });
                }

                //deletes fireworks if they go below the screen
                if (arr[i].drawnY > height || canBreak) {
                    arr.splice(i, 1);
                    return;
                }
            });

            if (canUpdate) {
                timeUntilNextFlame--;
            }

            if (currentLocation.enemies != undefined) {
                let bowsers = [];

                currentLocation.enemies.forEach((enemy, i, arr) => {
                    if (enemy.type == "Bowser") {
                        bowsers.push(arr[i]);
                    }
                });

                bowsers.forEach((bowser, i, arr) => {
                    if (mario.transition == "cleared castle") {
                        bowser.collisions = false;
                    }

                    if (world < 8 && timeUntilNextFlame <= 0 && currentLocation.enemies != undefined && bowser.alive && bowser.drawnX > newWidth && currentLocation.area[0][84].drawnX < newWidth && currentLocation.terrain == "Castle") {
                        flames.push(new Projectile("BowserFlame", width, 260 + standardHeight * random(0, 2), "left", 0, sounds));
                        sounds[13].currentTime = 0;
                        sounds[13].play();

                        timeUntilNextFlame = 100 * random(4, 5);
                    }

                    if (bowser != undefined && bowser.alive) {
                        if (bowser.timeToShootFlame <= 0 && bowser.alive && bowser.drawnX <= 600) {
                            flames.push(new Projectile("BowserFlame", bowser.directionFacing == "left" ? bowser.drawnX : bowser.drawnX + bowser.width, bowser.drawnY + 30, bowser.directionFacing, 0, sounds));
                            sounds[13].currentTime = 0;
                            sounds[13].play();

                            bowser.timeToShootFlame = 300;
                        }

                        if (world >= 8 || world == "D") {
                            if (canUpdate) {
                                bowser.timeToThrow--;
                            }

                            if (bowser.timeToThrow < 5) {
                                bowser.throwing = true;
                            } else {
                                bowser.throwing = false;
                            }

                            if (bowser.timeToThrow <= 0) {
                                bowser.hammers.push(new Projectile("Hammer", bowser.drawnX, bowser.drawnY, bowser.directionFacing, 1, bowser.sounds));

                                if (bowser.hammersLeft <= 0) {
                                    bowser.hammersLeft = random(3, 7);
                                    bowser.timeToThrow = 40;
                                } else {
                                    bowser.hammersLeft--;
                                    bowser.timeToThrow = 10;
                                }
                            }
                        }
                    }
                });
            }

            powerups.forEach((powerup, i, arr) => {
                if (canUpdate) {
                    arr[i].update(movingScreen, currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth, mario.velX);
                }

                if (powerup.drawnX <= width - shiftWidth && powerup.drawnX + powerup.width >= 0) {
                    powerup.draw();
                }

                if (arr[i].condition && arr[i].type != "Star" && arr[i].risen && !arr[i].isJumping && canUpdate) {
                    arr[i].fall();
                } else if (!arr[i].risen) {
                    arr[i].rise();
                }

                arr[i].collides(mario, powerups);
            });

            flames.forEach((flame, i, arr) => {
                if (flame.drawnX + flame.width >= 0) {
                    if (canUpdate) {
                        arr[i].update(movingScreen, currentLocation.canScroll, mario.velX);
                    }

                    arr[i].collides(mario);
                    flame.draw();
                }
            });

            currentLocation.enemies.forEach((enemy) => {
                enemy.hammers.forEach((hammer) => {
                    hammer.draw();
                });

                if (!enemy.gone && enemy.type.indexOf("Plant") == -1 && enemy.drawnX <= width - shiftWidth && enemy.drawnX + enemy.width >= 0) {
                    enemy.draw();
                }
            })

            currentLocation.area.forEach((row, j) => {
                row.forEach((block, i, arr) => {
                    if (arr[i].fireBar != undefined) {
                        arr[i].fireBar.forEach((fire, k, fireballs) => {
                            if (canUpdate) {
                                fireballs[k].update(movingScreen, currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth, mario.velX);
                            }

                            if (k > 0) {
                                fireballs[k].collides(mario);
                            }

                            fireballs[k].draw();
                        });
                    }
                });
            });

            timeUntilNextFireball--;

            if (mario.transition == "pipe") {
                changeLocation();

                if (mario.transition != "climbing vine") {
                    mario.transition = false;
                }
            }

            if (mario.coins == 100) {
                sounds[0].currentTime = 0;
                sounds[0].play();
                mario.lives++;
                mario.coins -= 100;
            }

            mario.update(reset, currentLocation.canScroll, currentLocation.terrain, world);

            currentLocation.area.forEach((row) => {
                row.forEach((block, i, arr) => {
                    if (arr[i].type == "Flagpole") {
                        arr[i].flagpoleCollisions(mario);
                    }
                })
            })

            canUpdate = true;

            if (![false, "cleared level", "cleared castle", "walkingIntoPipe", "vine"].includes(mario.transition)) {
                canUpdate = false;
            }

            mario.canStand = true;

            let a = [];

            currentLocation.area.forEach((row, j) => {
                a = row.filter((block, i, arr) => {
                    if (!block.hasCollisions) {
                        return false;
                    }

                    return mario.drawnX + mario.width - 5 > block.drawnX + 2 && mario.drawnX + 5 < block.drawnX + block.width - 2 && mario.drawnY >= block.drawnY;
                });

                if (a.length > 0) {
                    if (mario.isCrouching) {
                        a.forEach((block, i, arr) => {
                            if (block.type != "Air" && mario.drawnY <= block.drawnY + block.height) {
                                mario.canStand = false;
                            }
                        });
                    }
                }
            });

            if (!mario.behindCastle) {
                if (mario.transition != "down pipe" && mario.transition != "into pipe" && !mario.goingUpPipe) {
                    mario.draw();
                }
            } else if (gameTime > 0) {
                sounds[3].currentTime = 0;
                sounds[3].play();
                mario.addScore(50, -100, -100);
                gameTime--;
            } else if (mario.behindCastle && gameTime <= 0) {
                if (mario.transition != "cleared castle") {
                    setFireworks();
                } else {
                    canGoToNextLevel = true;
                }
            }

            if (stage == 4 && mario.transition != "down pipe" && mario.transition != "into pipe" && !mario.goingUpPipe) {
                mario.draw();
            }

            if (isHittingLeft) {
                mario.canMoveRight = false;

                if (mario.velX > 0) {
                    mario.drawnX = mario.alignX;
                    mario.velX = 0;
                }
            } else {
                mario.canMoveRight = true;
            }

            if (isHittingRight) {
                mario.canMoveLeft = false;

                if (mario.velX < 0) {
                    mario.drawnX = mario.alignX;
                    mario.velX = 0;
                }
            } else {
                mario.canMoveLeft = true;
            }
        }

        timeUntilNextFish--;
        goBackwards();

        graphics.fillStyle = "black";
        graphics.fillRect(-shiftWidth, 0, shiftWidth, height);
        graphics.fillRect(newWidth, 0, shiftWidth, height);

        if (canGoToNextLevel) {
            const canAuthenticateBool = nextLevel();

            if (canAuthenticateBool) {
                return true;
            }
        }
    }

    const update = () => {
        const canAuthenticateBool = draw();
        time++;

        if (canAuthenticateBool) {
            return true;
        }

        if (state === "game") {
            currentGame.playAudio(currentLocation.terrain, gameTime);
        }

        requestAnimationFrame(update);
    };

    let intervalId;

    /*const updateTime = () => {
        if (gameTime <= 0 && !mario.clearedLevel && mario.transition != "cleared castle") {
            mario.die();
        }

        if (gameTime == 100 && music.src.indexOf(`${pathname}/sounds/hurryUp.wav`) == -1 && music.src.indexOf(`${pathname}/sounds/savePrincess.wav`) == -1) {
            music.src = `${pathname}/sounds/hurryUp.wav`;
        }

        if (gameTime > 0 && mario.transition == false && !mario.clearedLevel && state == "game") {
            gameTime--;
        }

        if (quit) {
            clearInterval(intervalId);
            return;
        }
    }*/

    const updateTime = () => {
        if (quit) {
            clearInterval(intervalId);
            return;
        }

        if (gameTime <= 0 && !mario.clearedLevel && mario.transition !== "cleared castle") {
            mario.die();
            return;
        }

        if (gameTime === 100 && !music.src.includes(`${pathname}/sounds/hurryUp.wav`) && !music.src.includes(`${pathname}/sounds/savePrincess.wav`)) {
            music.src = `${pathname}/sounds/hurryUp.wav`;
        }

        if (gameTime > 0 && state === "game" && mario.transition === false && !mario.clearedLevel) {
            gameTime--;
        }
    };

    update();
    intervalId = setInterval(updateTime, 400);
}