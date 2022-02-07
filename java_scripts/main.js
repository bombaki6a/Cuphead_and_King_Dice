import Menu from "./menu.js";

const width = 1200;
const height = 700;

// Change body background color:
document.body.style.backgroundColor = "#333333";

// Set game area:
const canvas = SetGameArea(width, height);
const context = canvas.getContext("2d");

// Set main menu:
const menu = new Menu(canvas, context, width, height);

// Event listener functions:
canvas.addEventListener("click", menu.MouseClick);
canvas.addEventListener("mousemove", menu.MouseMove);
document.addEventListener("keydown", menu.EnterDown);

// Set game area function:
function SetGameArea(width, height) {
    var canvas = document.createElement("canvas");

    // Canvas settings:
    canvas.width = width;
    canvas.height = height;
    canvas.style = "position: absolute; top: 0; right: 0; left: 0; bottom: 0; margin: auto; border: 5px solid black;"
    
    // Add canvas to body:
    document.body.insertBefore(canvas, document.body.childNodes[2]);

    return canvas;
}
