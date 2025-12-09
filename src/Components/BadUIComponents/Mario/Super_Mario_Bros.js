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
import { setIsAbleToAuthenticate } from "../BadUIComponents";

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

    // Helper function to check if image is loaded
    const isImageLoaded = (img) => {
        return img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
    };

    // Initialize once
    const waterImage = new Image();
    waterImage.onerror = () => {
        console.error(`Failed to load WaterTop.png`);
    };
    waterImage.src = `${pathname}/images/WaterTop.png`;

    const setBackground = () => {
        if (currentLocation.terrain === "Underwater") {
            const waterY = standardHeight * 2;
            const waterWidth = standardWidth;
            const waterHeight = standardHeight;
            const numTiles = Math.ceil(width / standardWidth);

            for (let i = 0; i < numTiles; i++) {
                if (isImageLoaded(waterImage)) {
                    graphics.drawImage(waterImage, i * waterWidth, waterY, waterWidth, waterHeight);
                }
            }

            graphics.fillStyle = "#62adff";
            graphics.fillRect(0, 120, width, height);
        }

        if (currentLocation.background !== null) {
            const shouldScrollBackground = currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth;

            if (canUpdate) {
                currentLocation.background.update(movingScreen, shouldScrollBackground, mario.velX);
            }

            currentLocation.background.draw();
        }
    }

    const setCoins = () => {
        let coinList = mario.coinAnimationList;

        for (let i = coinList.length - 1; i >= 0; i--) {
            let coin = coinList[i];

            // Animate coin sprite
            coin.img.src = `${pathname}/images/CoinSpin${Math.floor(time / 4 % 4) + 1}.png`;

            if (canUpdate) {
                // Move with screen scrolling
                if (movingScreen && currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth) {
                    coin.xValue -= mario.velX;
                }

                // Animate vertical movement
                coin.timeUntilDisappear++;
                coin.yValue += (coin.timeUntilDisappear <= 25 ? -4 : 4);

                // Remove coin after lifetime
                if (coin.timeUntilDisappear >= 60) {
                    coinList.splice(i, 1);
                    continue; // Skip drawing this coin
                }
            }

            // Draw the coin
            graphics.drawImage(coin.img, Math.round(coin.xValue), Math.round(coin.yValue), standardWidth / 2, standardHeight);
        }
    };

    const setScores = () => {
        let scoreValues = mario.scoreValues;

        graphics.fillStyle = "white";
        graphics.font = "25px smb";

        for (let i = scoreValues.length - 1; i >= 0; i--) {
            let scoreObj = scoreValues[i];

            // Update timer
            scoreObj.timer++;

            // Grant 1-Up if needed
            if (scoreObj.has1Up) {
                sounds[0].currentTime = 0;
                sounds[0].play();
                mario.lives++;
                scoreObj.has1Up = false;
            }

            // Move with scrolling screen
            if (canUpdate && movingScreen && currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth) {
                scoreObj.x -= mario.velX;
            }

            // Float upwards
            scoreObj.y -= 3;

            // Draw the score (skip 50-point coins if needed)
            if (scoreObj.score !== 50) {
                graphics.fillText(scoreObj.score, scoreObj.x + 18, scoreObj.y);
            }

            // Remove after timer ends
            if (scoreObj.timer > 50) {
                scoreValues.splice(i, 1);
            }
        }
    };

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

        if (mario.lives === 0) {
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

                    if (arr[i].pulleyPair !== null) {
                        arr[i].pulleyPair.pulleyPair = arr[i];
                    }

                    arr[i].connection = connection;
                });
            });

            if (areas.background !== null) {
                areas.background = new Background(areas.background.img.src, areas.background.constantX, areas.background.constantY, areas.background.width, areas.background.height);
            }

            if (areas.enemies !== null) {
                let canResetEnemy = true;
                areas.enemies.forEach((enemy, i, arr) => {
                    if (canResetEnemy) {
                        arr[i] = new Enemy(enemy.constantX, enemy.constantY, enemy.constantWidth, enemy.constantHeight, enemy.storedType, gravity, sounds, areas.terrain, enemy.animated);
                    }

                    if (arr[i].drawnX === -1000) {
                        canResetEnemy = false;
                    }
                });

                for (let i = 0; i < areas.enemies.length; i++) {
                    if (areas.enemies[i].drawnX === -1000) {
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

        if (stage === 4) {
            mario.drawnY = 240 - (mario.height - 40);
        }

        powerups = [];
        fireballs = [];
        flames = [];
    }

    const nextLevel = () => {
        randomized = false;

        if (world === 1) {
            world = 8;
            stage = 3;
        } else if (world === 8) {
            world = "D";
            stage = 1;
        } else if (world === "D") {
            setIsAbleToAuthenticate(true);
            return true;
        }

        mario.isBig ? mario.drawnY = 440 : mario.drawnY = 480;

        if (stage === 4) {
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

        if (mario.blockStandingOn.pair !== undefined) {
            currentLocation.pair = mario.blockStandingOn.pair;
        }

        let shiftAmount = 0;

        if (game === "smb") {
            if (level === "1-1") {
                if (currentLocation === currentGame.level1_1Overworld) {
                    currentLocation = levels[level].areas[1];
                    mario.changeLocation("fall");
                } else {
                    currentLocation = levels[level].areas[0];

                    mario.changeLocation("up pipe");
                }
            }
        } else if (game === "smbtll") {
            if (level === "D-1") {
                if (currentLocation === currentGame.levelD_1Overworld) {
                    currentLocation = levels[level].areas[1];

                    mario.changeLocation("fall");
                } else {
                    currentLocation = levels[level].areas[0];

                    mario.changeLocation("up pipe");
                }
            }
        }

        mario.canClearLevel = false;

        let newX = currentLocation.pair === null ? shiftAmount : currentLocation.pair.constantX - 120;

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

                if (arr[i].pulleyPair !== null) {
                    arr[i].pulleyPair.pulleyPair = arr[i];
                }

                arr[i].connection = connection;
            });
        });

        if (currentLocation.background !== null) {
            currentLocation.background = new Background(currentLocation.background.img.src, currentLocation.background.constantX, currentLocation.background.constantY, currentLocation.background.width, currentLocation.background.height);
            currentLocation.background.drawnX -= newX;
        }

        let canResetEnemy = true;

        currentLocation.enemies.forEach((enemy, i, arr) => {
            if (canResetEnemy) {
                arr[i] = new Enemy(enemy.constantX, enemy.constantY, enemy.constantWidth, enemy.constantHeight, enemy.storedType, gravity, sounds, currentLocation.terrain, enemy.animated);
            }

            if (arr[i].drawnX === -1000) {
                canResetEnemy = false;
                currentLocation.enemies.length = i + 1;
            }
        });

        for (let i = 0; i < currentLocation.enemies.length; i++) {
            let enemy = currentLocation.enemies[i];

            if (enemy.drawnX !== -1000) {
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

        if (game === "smb" && currentLocation === currentGame.level8_4Castle) {
            timeUntilNextFish--;

            if (timeUntilNextFish <= 0) {
                timeUntilNextFish = 50;

                const fishCondition = currentLocation.area[10][198].drawnX <= 120 &&
                    currentLocation.area[10][243].drawnX >= 600;

                if (fishCondition) {
                    currentLocation.enemies.push(
                        new Enemy(
                            random(100, width - shiftWidth * 4),
                            height,
                            standardWidth,
                            standardHeight,
                            "O",
                            gravity,
                            sounds,
                            currentLocation.terrain,
                            0
                        )
                    );
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

        if (newX === undefined) return;

        newX -= 320;

        // Update blocks
        for (let row of currentLocation.area) {
            for (let i = 0; i < row.length; i++) {
                const block = row[i];
                const {
                    canEnter,
                    isEdge,
                    pair,
                    pulleyPair,
                    connection,
                    storedType,
                    constantX,
                    constantY,
                    constantWidth,
                    constantHeight,
                    terrain
                } = block;

                row[i] = new Block(storedType, constantX, constantY, constantX, constantY, constantWidth, constantHeight, sounds, terrain);

                const newBlock = row[i];
                newBlock.drawnX -= newX;
                newBlock.movingX -= newX;

                // Update firebars
                if (newBlock.fireBar) {
                    for (let fire of newBlock.fireBar) {
                        fire.drawnX -= newX;
                        fire.centerX -= newX;
                    }
                }

                newBlock.canEnter = canEnter;
                newBlock.isEdge = isEdge;
                newBlock.pair = pair;
                newBlock.pulleyPair = pulleyPair;
                if (newBlock.pulleyPair) newBlock.pulleyPair.pulleyPair = newBlock;
                newBlock.connection = connection;
            }
        }

        // Update background
        if (currentLocation.background) {
            const bg = currentLocation.background;
            currentLocation.background = new Background(bg.img.src, bg.constantX, bg.constantY, bg.width, bg.height);
            currentLocation.background.drawnX -= newX;
        }

        // Reset enemies if needed
        let canResetEnemy = true;
        for (let i = 0; i < currentLocation.enemies.length; i++) {
            const enemy = currentLocation.enemies[i];

            if (canResetEnemy) {
                currentLocation.enemies[i] = new Enemy(
                    enemy.constantX,
                    enemy.constantY,
                    enemy.constantWidth,
                    enemy.constantHeight,
                    enemy.storedType,
                    gravity,
                    sounds,
                    enemy.terrain,
                    enemy.animated
                );
            }

            if (currentLocation.enemies[i].drawnX === -1000) {
                canResetEnemy = false;
                currentLocation.enemies.length = i + 1;
            }
        }

        // Shift enemies left
        for (let enemy of currentLocation.enemies) {
            if (enemy.drawnX !== 1000) {
                enemy.drawnX -= newX;
                enemy.hitboxX -= newX;
            }
        }
    };

    const addDebris = (objects) => {
        for (let i = 0; i < objects.length; i++) {
            debris.push(objects[i]);
        }
    }

    const setDebris = () => {
        for (let i = debris.length - 1; i >= 0; i--) {
            let piece = debris[i];

            // Animate debris sprite
            const terrain = currentLocation.terrain !== "Bonus" ? currentLocation.terrain : "Underground";
            piece.img.src = `${pathname}/images/${terrain}BrokenBrick${(Math.floor(time / 10) % 4) + 1}.png`;

            if (canUpdate) {
                // Move with scrolling screen
                if (currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth) {
                    piece.x -= mario.velX;
                }

                // Apply physics
                piece.x += piece.velX;
                piece.time++;
                piece.y = piece.originalY - 2 * piece.time + 0.5 * gravity * piece.time ** 2;

                // Remove if off-screen
                if (piece.y > height) {
                    debris.splice(i, 1);
                    continue; // Skip drawing
                }
            }

            // Draw debris
            graphics.drawImage(piece.img, Math.round(piece.x), Math.round(piece.y), 20, 20);
        }
    };

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

    // HUD images (preload once)
    const hudCoins = [
        new Image(),
        new Image(),
        new Image()
    ];
    
    // Set up images with error handling
    hudCoins.forEach((img, index) => {
        img.onerror = () => {
            console.error(`Failed to load hudCoin${index + 1}.png`);
        };
        img.src = `${pathname}/images/hudCoin${index + 1}.png`;
    });

    // "X" image, assumed static
    const xImage = new Image();
    xImage.onerror = () => {
        console.error(`Failed to load xImage.png`);
    };
    xImage.src = `${pathname}/images/xImage.png`;

    // Font and color
    const HUD_FONT = "25px smb";
    const HUD_COLOR = "white";

    // Precompute constant positions
    const POS = {
        marioText: [100, 30],
        score: [110, 50],
        coin: [220, 32, 20, 20],
        xImage: [237, 32, 20, 20],
        coinsText: [275, 50],
        worldText: [400, 30],
        levelText: [400, 50],
        timeText: [550, 30],
        gameTimeText: [555, 50],
    };

    // Reuse to avoid allocations every frame
    function padNumber(num, length) {
        let str = num.toString();
        while (str.length < length) str = "0" + str;
        return str;
    }

    function drawHUD() {
        // Clear the canvas
        graphics.clearRect(0, 0, width, height);

        // Set font and color (can be skipped if already set)
        graphics.fillStyle = HUD_COLOR;
        graphics.font = HUD_FONT;

        // Static text
        graphics.fillText("MARIO", ...POS.marioText);

        // Only format numbers each frame
        const formattedScore = padNumber(score, 6);
        graphics.fillText(formattedScore, ...POS.score);

        // Coin animation index (0-2)
        let coinAnimIndex;

        if (state !== "loading") {
            coinAnimIndex = Math.floor(time % 50 / 10);
        } else {
            coinAnimIndex = 0;
        }

        const coinImageIndex = coinAnimIndex > 2 ? (coinAnimIndex === 3 ? 1 : 0) : coinAnimIndex;

        // Only draw images if they're loaded
        if (isImageLoaded(hudCoins[coinImageIndex])) {
            graphics.drawImage(hudCoins[coinImageIndex], ...POS.coin);
        }
        if (isImageLoaded(xImage)) {
            graphics.drawImage(xImage, ...POS.xImage);
        }

        // Coins text
        const formattedCoins = padNumber(mario.coins, 2);
        graphics.fillText(formattedCoins, ...POS.coinsText);

        // World and level
        graphics.fillText("WORLD", ...POS.worldText);
        graphics.fillText(level, ...POS.levelText);

        // Time
        graphics.fillText("TIME", ...POS.timeText);
        const formattedTime = padNumber(gameTime, 3);
        graphics.fillText(formattedTime, ...POS.gameTimeText);
    }

    // preload this outside the frame loop
    const smallMarioImage = new Image();
    smallMarioImage.onerror = () => {
        console.error(`Failed to load smallMarioStanding.png`);
    };
    smallMarioImage.src = `${pathname}/images/smallMarioStanding.png`;
    let currentMusicTrack = "";

    // Outside the loop
    let lastBackgroundColor = "";

    // Preload firework images once
    const fireworkImages = [];
    for (let i = 0; i < 3; i++) { // or however many variations you want
        const img = new Image();
        img.src = `${pathname}/images/firework${i}.png`; // replace with your actual paths
        fireworkImages.push(img);
    }

    function generateDebris(block) {
        const width = block.width;
        const height = block.height;
        const x = block.drawnX;
        const y = block.drawnY;

        return [
            { img: new Image(), x, y, originalY: y, time: 0, velX: -2 },
            { img: new Image(), x: x + width, y, originalY: y, time: 0, velX: 2 },
            { img: new Image(), x, y: y + height, originalY: y + height, time: 0, velX: -2 },
            { img: new Image(), x: x + width, y: y + height, originalY: y + height, time: 0, velX: 2 },
        ];
    }

    const draw = () => {
        drawHUD();

        if (state === "loading") {
            // Only change music if necessary
            // Outside the loop

            // Inside your frame loop (loading screen)
            if (mario.lives > 0) {
                let desiredMusic = `${pathname}/sounds/${currentLocation.terrain}.wav`;
                if (currentLocation === currentGame.level1_2Overworld1) {
                    desiredMusic = `${pathname}/sounds/overworldToUnderground.wav`;
                }

                if (currentMusicTrack !== desiredMusic) {
                    music.src = desiredMusic;
                    currentMusicTrack = desiredMusic;
                }
            }

            // Only set background if not already black
            if (canvas.style.background !== "black") {
                canvas.style.background = "black";
            }

            if (mario.lives > 0) {
                graphics.fillText(`world ${level}`, width / 2 - shiftWidth, 200);
                if (isImageLoaded(smallMarioImage)) {
                    graphics.drawImage(smallMarioImage, width / 2 - 75 - shiftWidth, 240, standardWidth, standardHeight);
                }
                if (currentGame.xImage && isImageLoaded(currentGame.xImage)) {
                    graphics.drawImage(currentGame.xImage, width / 2 - shiftWidth, 250, 20, 20);
                }
                graphics.fillText(mario.lives, 460 - shiftWidth, 270);
            } else {
                graphics.fillText("game over", width / 2 - shiftWidth, height / 2);
            }

            timeUntilPlay--;
            if (timeUntilPlay === 0 && mario.lives > 0) {
                state = "game";
            }
        } else if (state === "game") {
            const desiredBackground = currentLocation.color ?? "black";
            if (lastBackgroundColor !== desiredBackground) {
                canvas.style.background = desiredBackground;
                lastBackgroundColor = desiredBackground;
            }

            isHittingLeft = false;
            isHittingRight = false;

            if (mario.blockMovingOn !== null) {
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

            // Check if any block is a Flagpole
            possibleToNotScroll = !currentLocation.area.some(row =>
                row.some(block => block.type === "Flagpole")
            );

            // Cache last row and last block for efficiency
            const lastRow = currentLocation.area[currentLocation.area.length - 1];
            const lastBlock = lastRow[lastRow.length - 1];

            // Determine if scrolling is allowed
            if (lastBlock.drawnX <= 600 && possibleToNotScroll) {
                currentLocation.canScroll = false;

                // Only handle game-specific logic if needed
                if (game === "smb" && level === "1-2") {
                    if (currentLocation === currentGame.level1_2Overworld1) {
                        mario.canClearLevel = false;
                        if (!["into pipe", "pipe"].includes(mario.transition)) {
                            mario.transition = "walkingIntoPipe";
                        }
                    } else if (currentLocation === currentGame.level1_2Underground1) {
                        graphics.fillStyle = "white";
                        graphics.fillText("Welcome to warp zone!", 280, 240);
                        graphics.fillText("8-2", 120, 340);
                        graphics.fillText("8-1", 280, 340);
                        graphics.fillText("1-4", 440, 340);

                        // Update enemies efficiently
                        for (let i = 0; i < currentLocation.enemies.length; i++) {
                            currentLocation.enemies[i].drawnX = -100;
                        }
                    }
                }
            } else {
                currentLocation.canScroll = true;
            }

            // Reset standing state
            isStanding = false;

            setBackground();

            if (mario.transition === "down pipe" || mario.transition === "into pipe" || mario.goingUpPipe) {
                mario.draw();
            }

            const numRows = currentLocation.area.length;
            const shouldScroll = movingScreen && currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth && canUpdate;

            for (let j = 0; j < numRows; j++) {
                const row = currentLocation.area[j];
                const numCols = row.length;

                for (let i = 0; i < numCols; i++) {
                    const block = row[i];
                    if (!block) continue;

                    // Precompute neighbors
                    const topBlock = j > 0 ? currentLocation.area[j - 1][i] : null;
                    const bottomBlock = j + 1 < numRows ? currentLocation.area[j + 1][i] : null;
                    const leftBlock = i > 0 ? row[i - 1] : null;
                    const rightBlock = i + 1 < numCols ? row[i + 1] : null;

                    // Skip Air blocks unless scrolling
                    if (block.type === "Air") {
                        if (shouldScroll) {
                            block.drawnX -= mario.velX;
                        }
                        continue;
                    }

                    // Update block if allowed
                    if (canUpdate) {
                        block.update(movingScreen, currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth, mario.velX, mario.drawnX + mario.width / 2);

                        // Add bullets to enemies
                        for (let b = 0; b < block.bullets.length; b++) {
                            const bullet = block.bullets[b];
                            if (!bullet.addedToEnemies) {
                                bullet.addedToEnemies = true;
                                currentLocation.enemies.push(bullet);
                            }
                        }
                    }

                    // Cache block type flags
                    const isCoin = block.type.includes("Coin");
                    const isFlagpole = block.type.includes("Flagpole");
                    const isCastle = block.type === "Castle" || block.type === "BigCastle";
                    const isAxe = block.type === "Axe";
                    const isCannon = block.type.includes("Cannon");
                    const isVine = block.vineStructure !== null || block.type.includes("Vine");

                    // Block interactions
                    if (isCoin) {
                        block.collides(mario);
                    } else if (isFlagpole) {
                        if (mario.transition === "cleared level") {
                            if (block.offsetY + 79 + block.drawnY < 460) {
                                block.offsetY += 5;
                            } else {
                                mario.canGoToCastle = true;
                            }
                        }

                        if (mario.clearedLevel && fireworks.length === 0 && !mario.behindCastle) {
                            const fireworkNumber = gameTime % 10;
                            if ([1, 3, 6].includes(fireworkNumber)) {
                                for (let f = 0; f < fireworkNumber; f++) {
                                    fireworks.push({
                                        x: random(320, 720),
                                        y: random(120, 200),
                                        img: fireworkImages[f % fireworkImages.length], // preloaded images
                                        existence: 0
                                    });
                                }
                            }
                        }
                    } else if (isCastle) {
                        if (i > 10 && block.drawnX + block.width >= 0 && block.drawnX < newWidth) {
                            mario.canClearLevel = true;
                        }
                        if (block.castleCollisions(mario, gameTime, fireworks)) {
                            mario.timeToMoveToNextLevel++;
                            if (mario.timeToMoveToNextLevel >= 150) {
                                canGoToNextLevel = true;
                            }
                        }
                    } else if (isAxe) {
                        block.collides(mario);
                    } else {
                        // Top/Bottom/Left/Right collisions for Mario
                        if (!mario.goingUpPipe && canUpdate) {
                            let cantShoot = false;

                            // Top collisions
                            if (topBlock && !topBlock.hasCollisions && block.topCollisions(mario)) {
                                isStanding = true;
                                if (isCannon) cantShoot = true;
                            }

                            // Bottom collisions
                            if (bottomBlock && (!bottomBlock.hasCollisions || bottomBlock.type === "Air") && block.bottomCollisions(mario, addPowerup, addEnemy)) {
                                if (block.bumping > 0 && topBlock && topBlock.type === "Coin") {
                                    topBlock.type = "Air";
                                    mario.addCoin(block.drawnX + 10, block.drawnY - standardHeight);
                                    mario.coins++;
                                }

                                if (block.type === "Air") {
                                    addDebris(generateDebris(block)); // precreate debris images
                                }
                            }

                            // Vine collisions
                            if (isVine) block.vineCollisions(mario);

                            // Left collisions
                            if (!mario.clearedLevel && leftBlock && (!leftBlock.hasCollisions || leftBlock.type === "Air") && block.leftCollisions(mario)) {
                                isHittingLeft = true;
                                if (isCannon) cantShoot = true;
                            }

                            // Right collisions
                            if (!mario.clearedLevel && rightBlock && (!rightBlock.hasCollisions || rightBlock.type === "Air") && block.rightCollisions(mario)) {
                                isHittingRight = true;
                                if (isCannon) cantShoot = true;
                            }

                            // Cannon cooldown
                            if (cantShoot) {
                                for (let k = 0; k < numRows; k++) {
                                    currentLocation.area[k][i].timeToShootBullet = 100;
                                }
                            }
                        }

                        // Enemies collisions
                        if (currentLocation.enemies) {
                            for (let e = 0; e < currentLocation.enemies.length; e++) {
                                const enemy = currentLocation.enemies[e];
                                enemy.isStanding = false;

                                if (enemy.collisions && enemy.affectedByGravity) {
                                    if (topBlock && (!topBlock.hasCollisions || topBlock.type === "Air") && block.topCollisions(enemy, mario)) {
                                        enemy.isStanding = true;
                                    }
                                    if (leftBlock && !leftBlock.hasCollisions && block.leftCollisions(enemy)) {
                                        enemy.directionFacing = "left";
                                    } else if (rightBlock && !rightBlock.hasCollisions && block.rightCollisions(enemy)) {
                                        enemy.directionFacing = "right";
                                    }
                                }
                            }
                        }

                        // Powerups collisions
                        for (let p = 0; p < powerups.length; p++) {
                            const powerup = powerups[p];
                            if ((leftBlock && !leftBlock.hasCollisions && block.leftCollisions(powerup)) || (rightBlock && !rightBlock.hasCollisions && block.rightCollisions(powerup))) {
                                powerup.velX *= -1;
                            }
                            if (bottomBlock && !bottomBlock.hasCollisions && block.bottomCollisions(powerup)) powerup.hitBlock = true;
                            if (topBlock && !topBlock.hasCollisions && powerup.risen && !block.topCollisions(powerup)) powerup.condition = true;
                        }

                        // Fireballs collisions
                        for (let f = fireballs.length - 1; f >= 0; f--) {
                            const fireball = fireballs[f];
                            if ((leftBlock && !leftBlock.hasCollisions && block.leftCollisions(fireball)) ||
                                (rightBlock && !rightBlock.hasCollisions && block.rightCollisions(fireball)) ||
                                (bottomBlock && !bottomBlock.hasCollisions && block.bottomCollisions(fireball))) {
                                sounds[1].currentTime = 0;
                                sounds[1].play();
                                fireballs.splice(f, 1);
                                continue;
                            }
                            if (topBlock && !topBlock.hasCollisions && block.topCollisions(fireball)) { }
                        }
                    }
                }
            }

            // Determine if Mario is falling
            const canFall = !isStanding && !mario.isJumping && !mario.transition && !mario.clearedLevel && !mario.goingUpPipe && !mario.onSpring;
            if (canFall) {
                mario.falling = true;
                mario.isOnGround = false;

                if (currentLocation.terrain !== "Underwater") {
                    mario.fall();
                } else {
                    mario.drawnY += 2; // simulate slower underwater fall
                    mario.isOnGround = false;
                }
            }

            // Draw "air-layer" blocks efficiently
            const visibleTypes = new Set(["Water", "Lava", "Air"]); // faster lookup
            const minX = 0;
            const maxX = width - shiftWidth;

            for (let j = 0; j < currentLocation.area.length; j++) {
                const row = currentLocation.area[j];
                for (let i = 0; i < row.length; i++) {
                    const block = row[i];
                    if (block && visibleTypes.has(block.type)) {
                        const rightX = block.drawnX + block.width;
                        if (block.drawnX <= maxX && rightX >= minX) {
                            block.draw();
                        }
                    }
                }
            }

            //All enemy logic
            if (currentLocation.enemies) {
                for (let enemy of currentLocation.enemies) {
                    if (canUpdate) {
                        enemy.update(
                            movingScreen,
                            currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth,
                            mario.velX,
                            mario.drawnX,
                            mario.drawnY + mario.height / 2,
                            world
                        );

                        for (let hammer of enemy.hammers) {
                            hammer.update(
                                movingScreen,
                                currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth,
                                mario.velX,
                                mario.drawnX,
                                mario.velX
                            );
                            hammer.collides(mario);
                        }

                        // Add spinies if not already in enemies
                        for (let spiny of enemy.spinies) {
                            if (!currentLocation.enemies.includes(spiny)) {
                                currentLocation.enemies.push(spiny);
                            }
                        }
                    }

                    if (!enemy.gone) {
                        if (enemy.alive) {
                            if (!mario.transition && !mario.goingUpPipe) {
                                enemy.topMarioCollisions(mario);
                                enemy.otherCollisions(mario, mario);
                            } else {
                                enemy.timeToMoveUpAndDown = 0;
                            }

                            for (let other of currentLocation.enemies) {
                                if ((enemy.collisions && other.collisions) || enemy.moving || other.moving) {
                                    enemy.otherCollisions(other, mario);
                                }
                            }
                        }

                        // RedKoopa wall checks
                        if (enemy.type === "RedKoopa" && !enemy.inShell && enemy.drawnY === enemy.lastGroundY) {
                            const rowIndex = Math.floor((enemy.drawnY + enemy.height) / standardHeight);
                            const row = currentLocation.area[rowIndex] || [];
                            for (let block of row) {
                                if (!block.hasCollisions) {
                                    if (enemy.directionFacing === "left" && enemy.drawnX - block.drawnX > 0 && enemy.drawnX - block.drawnX < 20) {
                                        enemy.directionFacing = "right";
                                    } else if (enemy.directionFacing === "right" && block.drawnX - enemy.drawnX > 0 && block.drawnX - enemy.drawnX < 20) {
                                        enemy.directionFacing = "left";
                                    }
                                }
                            }
                        }

                        // Gravity / falling
                        if (
                            canUpdate &&
                            !enemy.isStanding &&
                            enemy.affectedByGravity &&
                            !enemy.isFlying &&
                            !enemy.isJumping &&
                            enemy.type.indexOf("Lakitu") === -1 &&
                            enemy.type !== "BlooperSwimming" &&
                            enemy.type !== "Podobo"
                        ) {
                            enemy.fall();
                        }

                        // Draw plants
                        if (enemy.type.includes("Plant") && enemy.drawnX + enemy.width >= 0 && enemy.drawnX <= width - shiftWidth) {
                            enemy.draw();
                        }

                        // Off-screen death
                        if (enemy.drawnY > height && enemy.type !== "Podobo") {
                            enemy.die("stomp");
                        }
                    }
                }
            }

            currentLocation.area.forEach((row) => {
                row.forEach((block) => {
                    if (block.drawnX + block.width >= 0 && block.drawnX <= width - shiftWidth && !["Water", "Lava", "Air"].includes(block.type)) {

                        // Draw the block
                        block.draw();

                        // Extra handling for static blocks (ground/cloud) when level is cleared
                        if (block.directionMoving === null && mario.clearedLevel && (block.type.includes("Ground") || block.type.includes("Cloud")) && block.drawnX > newWidth / 2) {
                            let ground = new Image();
                            ground.src = block.img.src;

                            for (let i = 0; i < 10; i++) {
                                graphics.drawImage(ground, block.drawnX + i * block.width, block.drawnY, block.width, block.height);
                            }
                        }
                    }
                });
            });

            //HERE
            setScores();

            setCoins();
            setDebris();

            for (let i = fireballs.length - 1; i >= 0; i--) {
                let fireball = fireballs[i];

                if (canUpdate) {
                    fireball.update(
                        movingScreen,
                        currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth,
                        mario.velX
                    );
                }

                // Draw if on-screen
                if (fireball.drawnX <= width - shiftWidth && fireball.drawnX + fireball.width >= 0) {
                    fireball.draw();
                }

                // Check collisions with enemies
                let canBreak = false;
                if (currentLocation.enemies) {
                    for (let enemy of currentLocation.enemies) {
                        if (fireball.collides(enemy, mario)) {
                            canBreak = true;
                            break;
                        }
                    }
                }

                // Remove fireball if off-screen or collided
                if (fireball.drawnY > height || canBreak) {
                    fireballs.splice(i, 1);
                }
            }

            if (canUpdate) {
                timeUntilNextFlame--;
            }

            if (currentLocation.enemies && currentLocation.enemies.length > 0) {
                // Filter only Bowser enemies once
                const bowsers = currentLocation.enemies.filter(enemy => enemy.type === "Bowser");

                for (let bowser of bowsers) {
                    if (!bowser.alive) continue;

                    // Disable collisions after Mario clears castle
                    if (mario.transition === "cleared castle") {
                        bowser.collisions = false;
                    }

                    // Pre-bowser flames for early castle worlds
                    if (world < 8 && timeUntilNextFlame <= 0 && currentLocation.terrain === "Castle") {
                        if (bowser.drawnX > newWidth && currentLocation.area[0][84].drawnX < newWidth) {
                            flames.push(new Projectile(
                                "BowserFlame",
                                width,
                                260 + standardHeight * random(0, 2),
                                "left",
                                0,
                                sounds
                            ));
                            sounds[13].currentTime = 0;
                            sounds[13].play();
                            timeUntilNextFlame = 100 * random(4, 5);
                        }
                    }

                    // Bowser shooting flames when on screen
                    if (bowser.timeToShootFlame <= 0 && bowser.drawnX <= 600) {
                        flames.push(new Projectile(
                            "BowserFlame",
                            bowser.directionFacing === "left" ? bowser.drawnX : bowser.drawnX + bowser.width,
                            bowser.drawnY + 30,
                            bowser.directionFacing,
                            0,
                            sounds
                        ));
                        sounds[13].currentTime = 0;
                        sounds[13].play();
                        bowser.timeToShootFlame = 300;
                    }

                    // Bowser throwing hammers in later worlds
                    if (world >= 8 || world === "D") {
                        if (canUpdate) bowser.timeToThrow--;

                        bowser.throwing = bowser.timeToThrow < 5;

                        if (bowser.timeToThrow <= 0) {
                            bowser.hammers.push(new Projectile(
                                "Hammer",
                                bowser.drawnX,
                                bowser.drawnY,
                                bowser.directionFacing,
                                1,
                                bowser.sounds
                            ));

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
            }

            for (let powerup of powerups) {
                if (canUpdate) {
                    powerup.update(
                        movingScreen,
                        currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth,
                        mario.velX
                    );
                }

                const powerupRight = powerup.drawnX + powerup.width;
                if (powerup.drawnX <= width - shiftWidth && powerupRight >= 0) {
                    powerup.draw();
                }

                if (canUpdate) {
                    if (powerup.condition && powerup.type !== "Star" && powerup.risen && !powerup.isJumping) {
                        powerup.fall();
                    } else if (!powerup.risen) {
                        powerup.rise();
                    }
                }

                powerup.collides(mario, powerups);
            }

            for (let flame of flames) {
                const flameRight = flame.drawnX + flame.width;
                if (flameRight >= 0) {
                    if (canUpdate) {
                        flame.update(movingScreen, currentLocation.canScroll, mario.velX);
                    }

                    flame.collides(mario);
                    flame.draw();
                }
            }

            for (let enemy of currentLocation.enemies) {
                // Draw all hammers
                for (let hammer of enemy.hammers) {
                    hammer.draw();
                }

                // Draw enemy if it's on screen and not a plant
                const enemyRight = enemy.drawnX + enemy.width;
                if (!enemy.gone && enemy.type.indexOf("Plant") === -1 && enemy.drawnX <= width - shiftWidth && enemyRight >= 0) {
                    enemy.draw();
                }
            }

            for (let row of currentLocation.area) {
                for (let block of row) {
                    if (block.fireBar !== undefined) {
                        for (let i = 0; i < block.fireBar.length; i++) {
                            const fire = block.fireBar[i];

                            if (canUpdate) {
                                fire.update(movingScreen, currentLocation.canScroll && mario.drawnX >= width / 2 - shiftWidth, mario.velX);
                            }

                            if (i > 0) {
                                fire.collides(mario);
                            }

                            fire.draw();
                        }
                    }
                }
            }

            timeUntilNextFireball--;

            if (mario.transition === "pipe") {
                changeLocation();

                if (mario.transition !== "climbing vine") {
                    mario.transition = false;
                }
            }

            if (mario.coins === 100) {
                sounds[0].currentTime = 0;
                sounds[0].play();
                mario.lives++;
                mario.coins -= 100;
            }

            mario.update(reset, currentLocation.canScroll, currentLocation.terrain, world);

            for (let row of currentLocation.area) {
                for (let block of row) {
                    if (block.type === "Flagpole") {
                        block.flagpoleCollisions(mario);
                    }
                }
            }

            canUpdate = true;

            if (![false, "cleared level", "cleared castle", "walkingIntoPipe", "vine"].includes(mario.transition)) {
                canUpdate = false;
            }

            mario.canStand = true;

            let a = [];

            for (let row of currentLocation.area) {
                let canStand = true;

                for (let block of row) {
                    if (!block.hasCollisions) continue;

                    if (
                        mario.drawnX + mario.width - 5 > block.drawnX + 2 &&
                        mario.drawnX + 5 < block.drawnX + block.width - 2 &&
                        mario.drawnY >= block.drawnY
                    ) {
                        if (mario.isCrouching && block.type !== "Air" && mario.drawnY <= block.drawnY + block.height) {
                            canStand = false;
                            break; // no need to check further blocks in this row
                        }
                    }
                }

                if (!canStand) {
                    mario.canStand = false;
                }
            }

            if (!mario.behindCastle) {
                if (mario.transition !== "down pipe" && mario.transition !== "into pipe" && !mario.goingUpPipe) {
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

            if (stage === 4 && mario.transition !== "down pipe" && mario.transition !== "into pipe" && !mario.goingUpPipe) {
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

    const updateTime = () => {
        if (gameTime <= 0 && !mario.clearedLevel && mario.transition !== "cleared castle") {
            mario.die();
        }

        if (gameTime === 100 && music.src.indexOf(`${pathname}/sounds/hurryUp.wav`) === -1 && music.src.indexOf(`${pathname}/sounds/savePrincess.wav`) === -1) {
            music.src = `${pathname}/sounds/hurryUp.wav`;
        }

        if (gameTime > 0 && mario.transition === false && !mario.clearedLevel && state === "game") {
            gameTime--;
        }

        if (quit) {
            clearInterval(intervalId);
            return;
        }
    }

    update();
    intervalId = setInterval(updateTime, 400);
}