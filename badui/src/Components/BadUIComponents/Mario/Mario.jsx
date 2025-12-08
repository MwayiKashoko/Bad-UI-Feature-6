import { gameEngine } from "./Super_Mario_Bros";

export let graphics;
//volume slider
//width and height of the canvas (width = 800px, height = 600px) 4:3 aspect ratio
export let width;
export let height;

//The shift to match each game to it's original aspect ratio
export let shiftWidth = 80;
//newWidth as a result of shiftWidth
export let newWidth;

//Determines which game is currently running (smb, smbll smb2, smb3, smw, nsmbds, nsmbwii, smm...)
export let game = "smbtll";
//current pathname of the url
//Pathname to get all sounds, music, images, etc.
export let pathname = `/games/smbtll`;
//If the game has ended then the code will reset back to the game selection screen
export let gameEnded = false;

export const marioCode = (canvas) => {
    const font = new FontFace('smb', 'url(/fonts/smb.otf)');
    font.load().then((loaded) => {
        document.fonts.add(loaded);
    });

    graphics = canvas.getContext("2d");
    graphics.textAlign = "center";
    width = canvas.width;
    height = canvas.height;
    newWidth = width - shiftWidth * 2;
    gameEngine(canvas);
}

export const setPathname = (name) => {
    pathname = name;
}