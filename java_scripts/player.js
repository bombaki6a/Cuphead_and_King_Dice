import SpriteAnimation from "./sprite_animation.js";

export default class Player {
    runSize = 9;
    idleSize = 5;
    jumpSize = 8;
    dustSize = 14;
    deadSize = 24;

    image = null;

    isRun = false;
    isLeft = false;
    isJump = false;
    isDead = false;
    
    onCard = false;
    onFloor = true;
    isDustOn = true;

    velocityX = 0;
    velocityY = 0;
    
    animationSpeed = 6;
    
    dustX = 30;
    dustY = 0.78;
    dustHeight = 30;
    dustDuration = 280;
    dustSrc = "images/player/dust/cuphead_jump_dust_a_(?).png";
    
    deadSrc = "images/player/dead/cuphead_ghost_?.png";
    runLeft = "images/player/run/left/cuphead_run_000?.png";
    runRight = "images/player/run/right/cuphead_run_000?.png";
    jumpLeft = "images/player/jump/left/cuphead_jump_000?.png";
    jumpRight = "images/player/jump/right/cuphead_jump_000?.png";
    idleLeft = "images/player/idle/left/cuphead_idle_000?.png";
    idleRight = "images/player/idle/right/cuphead_idle_000?.png";

    constructor(width, height) {
        this.width = width;
        this.height = height;

        // Jump audio:
        this.jump = new Audio("sounds/jump.ogg");
        this.onFloorSound = new Audio("sounds/on_floor.ogg");
        this.jump.volume = 0.05;
        this.onFloorSound.volume = 0.3;

        // Dust animation:
        this.dustWidth = this.width + this.dustX;
        this.dustAnimation = new SpriteAnimation(this.dustSrc, this.dustSize, this.animationSpeed);

        // Character animation:
        this.deadAnimation = new SpriteAnimation(this.deadSrc, this.deadSize, this.animationSpeed);
        this.idleLeftAnimation = new SpriteAnimation(this.idleLeft, this.idleSize, this.animationSpeed);
        this.idleRightAnimation = new SpriteAnimation(this.idleRight, this.idleSize, this.animationSpeed);
        this.runLeftAnimation = new SpriteAnimation(this.runLeft, this.runSize, this.animationSpeed / 2);
        this.runRightAnimation = new SpriteAnimation(this.runRight, this.runSize, this.animationSpeed / 2);
        this.jumpLeftAnimation = new SpriteAnimation(this.jumpLeft, this.jumpSize, this.animationSpeed / 2);
        this.jumpRightAnimation = new SpriteAnimation(this.jumpRight, this.jumpSize, this.animationSpeed / 2);

        // Events listener:
        document.addEventListener("keyup", this.KeyUp);
        document.addEventListener("keydown", this.KeyDown);
    }

    // Key down function:
    KeyDown = (event) => {
        switch(event.code) {
            case 'KeyA':
                this.isRun = true;
                this.isLeft = true;
                break;
            case 'KeyD':
                this.isRun = true;
                this.isLeft = false;
                break;
            case 'KeyW':
                this.isJump = true;
                break;
            case 'Space':
                this.isJump = true;
                break;
        }
    }

    // Key up function:
    KeyUp = (event) => {
        switch(event.code) {
            case 'KeyA':
                this.isRun = false;
                break;
            case 'KeyD':
                this.isRun = false;
                break;
            case 'KeyW':
                this.isJump = false;
                break;
            case 'Space':
                this.isJump = false;
                break;
        }
    }

    // Remove listeners function:
    RemoveListeners() {
        document.removeEventListener("keyup", this.KeyUp);
        document.removeEventListener("keydown",this.KeyDown);
    }

    // Drawing dust function:
    DrawingDust(context, x, y) {
        if (this.onFloor && this.isDustOn) {
            this.isDustOn = false;
            this.onFloorSound.play();
            this.dustAnimation.Reset();

            var interval = setInterval(() => {
                this.image_dust = this.dustAnimation.GetImage();
                context.drawImage(this.image_dust, x - (this.dustX / 2), y + (this.height * this.dustY), this.dustWidth, this.dustHeight);
            });

            setTimeout(() => {
                clearInterval(interval);
            }, this.dustDuration);
        }
    }
    
    // Drawing function:
    Drawing(context, x, y) {
        if (this.isDead) {
            this.RemoveListeners();

            this.image = this.deadAnimation.GetImage();
            context.drawImage(this.image, x, y, this.width, this.height);
        } else {
            if (this.isJump && this.onFloor) {
                this.onFloor = false;
                this.isDustOn = true;
    
                this.jump.play();
            }
            
            if (!this.isLeft && !this.onFloor) {
                this.image = this.jumpRightAnimation.GetImage();
            } else if (this.isLeft && !this.onFloor) {
                this.image = this.jumpLeftAnimation.GetImage();
            } else if (this.isLeft) {
                this.DrawingDust(context, x, y);
                
                if (this.isRun) {
                    this.image = this.runLeftAnimation.GetImage();
                } else {
                    this.image = this.idleLeftAnimation.GetImage();
                }
            } else if (!this.isLeft) {
                this.DrawingDust(context, x, y);
    
                if (this.isRun) {
                    this.image = this.runRightAnimation.GetImage();
                } else {
                    this.image = this.idleRightAnimation.GetImage();
                }
            }
            
            context.drawImage(this.image, x, y, this.width, this.height);
        }
    }
}
