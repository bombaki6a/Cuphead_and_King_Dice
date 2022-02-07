import SpriteAnimation from "./sprite_animation.js";

export default class Card {
    cards_size = 16;

    animationSpeed = 6;

    explostionWidth = 100;
    explostionHeight = 100;

    image = null;
    isRed = false;
    isLeft = false;

    velocityX = 0;
    velocityY = 0;

    playerIsOn = false;
    cardPoint = false;

    redLeft = "images/cards/red/left/boss-battle-kingdice-heartcards (?).png";
    redRight = "images/cards/red/right/boss-battle-kingdice-heartcards (?).png";
    blackLeft = "images/cards/black/left/boss-battle-kingdice-clubcards (?).png";
    blackRight = "images/cards/black/right/boss-battle-kingdice-clubcards (?).png";

    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.bell = new Audio("sounds/bell.ogg");
        this.bell.volume = 0.3;

        this.heartLeftAnimation = new SpriteAnimation(this.redLeft, this.cards_size, this.animationSpeed);
        this.heartRightAnimation = new SpriteAnimation(this.redRight, this.cards_size, this.animationSpeed);
        this.clubRightAnimation = new SpriteAnimation(this.blackRight, this.cards_size, this.animationSpeed);
        this.clubLeftAnimation = new SpriteAnimation(this.blackLeft, this.cards_size, this.animationSpeed);
    }

    // Get point function:
    GetPoint() {
        if (this.cardPoint) {
            this.cardPoint = false;
            return 1;
        } else {
            return 0;
        }
    }

    // Stop animation fucntion:
    StopAnimation() {
        this.clubLeftAnimation.Stop();
        this.clubRightAnimation.Stop();
        this.heartLeftAnimation.Stop();
        this.heartRightAnimation.Stop();
    }

    // Drawing function:
    Drawing(context, x, y) {
        if (this.isRed) {
            if (this.isLeft) {
                this.image = this.heartLeftAnimation.GetImage();
            } else {
                this.image = this.heartRightAnimation.GetImage();
            }
        } else {
            if (this.isLeft) {
                this.image = this.clubLeftAnimation.GetImage();
            } else {
                this.image = this.clubRightAnimation.GetImage();
            }
        }

        if (this.isRed && this.playerIsOn) {
            this.bell.play();
            this.playerIsOn = false;
        }

        context.drawImage(this.image, x, y, this.width, this.height);
    }
}
