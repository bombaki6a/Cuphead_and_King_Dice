import SpriteAnimation from "./sprite_animation.js";

export default class KingDice {
    idleSize = 33;

    image = null;
    animationSpeed = 6;

    idle = "images/king_dice/idle/boss-battle-kingdice-idle (?).png";

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.idleAnimation = new SpriteAnimation(this.idle, this.idleSize, this.animationSpeed);
    }

    // Stop animation function:
    StopAnimation() {
        this.idleAnimation.Stop();
    }
    
    // Drawing function:
    Drawing(context, x, y) {
        this.image = this.idleAnimation.GetImage();
        context.drawImage(this.image, x, y, this.width, this.height);
    }
}
