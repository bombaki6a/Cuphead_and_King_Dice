import Game from "./game.js";
import image from "./image.js";

export default class Menu { 
    buttonX = 0;
    buttonY = 0;
    buttonWidth = 350;
    buttonHeight = 80;
    
    strok = 6;
    radius = 6;

    into = false;
    
    buttonStyle = '#d0c4b2';
    buttonStyleHover = '#cb6147';
    
    buttonBorder = '#5a554a';
    buttonFontColor = '#3c4239';
    
    buttonPlay = 'PLAY';
    buttonInfo = 'INFO';
    
    fontPlayWidth = 70;
    fontInfoWidth = 80;

    fontHeight = 20;
    fontStyle = '60px Comic Sans MS';
    
    buttonPlayPath;
    buttonInfoPath;

    gitHubLink = "https://github.com/bombaki6a/Cuphead_and_King_Dice/";

    buttonSoundPath = "sounds/hover_sound.ogg";
    backgroundPath = "images/background/title_screen_background.png";

    constructor (canvas, context, width, height) {
        this.width = width;
        this.height = height;

        this.canvas = canvas;
        this.context = context;
        this.ctx = this.canvas.getBoundingClientRect();

        this.background_image = image(this.backgroundPath);

        this.interval = setInterval(() => {
            this.Drawing(this.buttonStyle, this.buttonStyle);
        }, 1000 / 60);

        setTimeout(() => {
            clearInterval(this.interval);
        }, 1000);
    }

    // Rounding the corners of the rects:
    RoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.fill();
    }

    // Button drwing function:
    ButtonDrawing(title, x, y, width, height, color, border) {
        this.context.fillStyle = this.buttonBorder;
        this.RoundedRect(this.context, x - (border / 2), y - (border / 2), width + border, height + border, this.radius);
        
        this.context.fillStyle = color;
        this.RoundedRect(this.context, x, y, width, height, this.radius);
        
        this.context.fillStyle = this.buttonFontColor;

        var f_x = (x + this.buttonWidth / 2) - this.font_width;
        var f_y = (y + this.buttonHeight / 2) + this.fontHeight;

        this.context.fillText(title,  f_x, f_y);
        this.context.beginPath();
    }

    // Drawing fucntion:
    Drawing(play_color, info_color) {
        // background image:
        this.context.font = this.fontStyle;
        this.context.drawImage(this.background_image, 0, 0, this.width, this.height);
        
        this.buttonX = (this.width - this.buttonWidth) / 2;
        this.buttonY = (this.height - this.buttonHeight) / 2;
        
        // play button:
        this.buttonPlayPath = {
            x:this.buttonX,
            y:this.buttonY,
            width:this.buttonWidth,
            height:this.buttonHeight
        };
        
        this.font_width = this.fontPlayWidth;
        this.ButtonDrawing(this.buttonPlay, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, play_color, this.strok);
        
        // info button:
        this.buttonY += 120;
        
        this.buttonInfoPath = {
            x:this.buttonX,
            y:this.buttonY,
            width:this.buttonWidth,
            height:this.buttonHeight
        };
        
        // info button:
        this.font_width = this.fontInfoWidth;
        this.ButtonDrawing(this.buttonInfo, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, info_color, this.strok);
    }

    // Drawing hover play button:
    PlayHover() {
        if (this.into) {
            this.Drawing(this.buttonStyleHover, this.buttonStyle);
        } else {
            this.Drawing(this.buttonStyle, this.buttonStyle);
        }
    }

    // Drawing hover info button:
    InfoHover() {
        if (this.into) {
            this.Drawing(this.buttonStyle, this.buttonStyleHover);
        } else {
            this.Drawing(this.buttonStyle, this.buttonStyle);
        }
    }

     // Change mouse fuction:
     MousePointer(isPointer) {
        if (isPointer) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    // Detect mouse into rect:
    MouseInto(xy, element, border) {
        if (xy.x > element.x && xy.x < (element.x + border) + element.width && xy.y < (element.y + border) + element.height && xy.y > element.y) {
            return true;
        } else {
            return false;
        }
    }

    // Hover sound fuction:
    SoundHoverButton() {
        var sound = new Audio(this.buttonSoundPath);
        sound.volume = 0.1;
        sound.play();
    }

    // Create game:
    CreatGame() {
        this.MousePointer(false);
            
        this.context.clearRect(0, 0, this.width, this.height);
        
        new Game(this.context, this.width, this.height);
        this.canvas.removeEventListener("mousemove", this.MouseMove);
        this.canvas.removeEventListener("click", this.MouseClick);

        document.removeEventListener("keydown", this.EnterDown);
    }

    // Enter down function:
    EnterDown = (event) => {
        if (event.code == "Enter") {
            this.CreatGame();
        }
    }

    // Mouse click fuction:
    MouseClick = (event) => {
        var border = this.strok;
        var play = this.buttonPlayPath;
        var info = this.buttonInfoPath;
        
        var xy = {
            x: event.clientX - this.ctx.left,
            y: event.clientY - this.ctx.top
        }
        
        if (this.MouseInto(xy, play, border)) {
            this.CreatGame();
        } else if (this.MouseInto(xy, info, border)) {
            window.open(this.gitHubLink);
        }
    }

    // Mouse move function:
    MouseMove = (event) => {
        var border = this.strok;
        var play = this.buttonPlayPath;
        var info = this.buttonInfoPath;
        
        var xy = {
            x: event.clientX - this.ctx.left,
            y: event.clientY - this.ctx.top
        }
        
        if (this.MouseInto(xy, play, border)) {
            if (this.into) {
                this.PlayHover();
                this.MousePointer(true);
                this.SoundHoverButton();
                
                this.into = false;
            }
        } else if (this.MouseInto(xy, info, border)) {
            if (this.into) {
                this.InfoHover();
                this.MousePointer(true);
                this.SoundHoverButton();
        
                this.into = false;
            }
        } else {
            if (!this.into) {
                this.PlayHover();
                this.InfoHover();
                this.MousePointer(false);
        
                this.into = true;
            }
        }
    }
}
