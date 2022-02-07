import Card from "./card.js";
import image from "./image.js";
import Player from "./player.js";
import KingDice from "./king_dice.js";

export default class Game {
    // King Dice;
    kingDiceWidth = 890;
    kingDiceHeight = 460;

    // Player:
    playerWidth = 80;
    playerHeight = 120;

    jump = 20;
    speed = 10;
    gravity = 20;

    isStillJump = false;

    // Cards:
    cardWidth = 100;
    cardHeight = 250;
    
    cards = [];
    cardsN = 3;
    randomRed = 0;
    cardSpeed = 0;
    cardsSpawnTime = 5000;

    // Game:
    minArea = 0;
    maxCeiling = 0;

    chipsWidth = 129;
    chipsHeight = 119;

    bestScore = 0;
    playerScore = 0;

    // Fonts:
    color = "#ffffff";
    font = "25px Comic Sans MS";

    // Dead screen:
    keyIsAdded = true;
    deadFont = "60px Georgia";
    scoreFont = "50px Georgia";
    deadFill = "rgba(38, 38, 38, 0.6)";
    deadFontColor = "rgba(255, 255, 255, 1)";
    
    scoreWidth = 160;
    enterWidth = 620;
    youDiedWidth = 280;
    bestScoreWidth = 280;

    // Files src:
    sadSrc = "sounds/sad.ogg";
    backgroundMusic = "sounds/confrontation.ogg";
    backgroundPath = "images/background/dice_palace.png";
    backgroundChipsPath = "images/background/chips.png";

    constructor(context, width, height) {
        this.width = width;
        this.height = height;
        this.context = context;
        
        this.SetBestScore();

        this.backgroundImage = image(this.backgroundPath);
        this.backgroundChips = image(this.backgroundChipsPath);

        this.chipsX = this.width - this.chipsWidth;
        this.chipsY = this.height - this.chipsHeight;

        this.floor = this.height - (this.playerHeight * 1.7);

        this.maxArea = (this.width - this.playerWidth);

        this.kingDiceX = ((this.width - this.kingDiceWidth) / 2) + 12;
        this.kingDiceY = -89;
        
        this.kingDice = new KingDice(this.kingDiceWidth, this.kingDiceHeight);
        this.player = new Player(this.playerWidth, this.playerHeight);

        this.player.velocityX = (this.width - this.playerWidth) / 2;
        this.player.velocityY = 0;
        this.player.onFloor = false;

        this.isStillJump = true;

        this.CreateCards();
        this.CreateSpawn();

        this.SetBackgroundMusic();

        this.sadSound = new Audio(this.sadSrc);
        this.sadSound.volume = 0.1;
        
        this.inteval = setInterval(() => {
            this.Drawing();
        }, 1000 / 60);
    }

    // Cards spawn function:
    CreateSpawn() {
        setTimeout(() => {
            this.cardSpeed = 6;
            this.cardsSpawn = setInterval(() => {
                if ((this.playerScore == 5) || (this.playerScore == 10)) {
                    this.cardsSpawnTime /= 2;
                    this.cardSpeed += 3;
                }

                this.CreateCards();
            }, this.cardsSpawnTime);
        }, 2000);
    }

    // Bakground music:
    SetBackgroundMusic() {
        this.music = new Audio(this.backgroundMusic);
        this.music.volume = 0.02;
        this.music.loop = true;
        this.music.play();
    }

    // Objects collision fucntio:
    ObjectsCollision(player, card) {
        return this.ObjectsCollisionJump(player, card, 0);
    }

    // Objects collision fix jump fucntion:
    ObjectsCollisionJump(player, card, x) {
        var playerX = player.velocityX + player.width;
        var cardX = card.velocityX + card.width;

        var playerY = player.velocityY + player.height;
        var cardY = card.velocityY + card.height;

        if (playerX - x >= card.velocityX && player.velocityX <= cardX - x && playerY > card.velocityY && player.velocityY < cardY) {
            return true;
        } else {
            return false;
        }
    }

    // Set best score function:
    SetBestScore() {
        if ("best_score" in localStorage) {
            this.bestScore = localStorage.best_score;
        } else {
            this.bestScore = 0;
        }

        if (this.playerScore > this.bestScore) {
            this.bestScore = this.playerScore;
        }

        localStorage.setItem("best_score", this.bestScore);
    }

    // Player score:
    DrawingScore() {
        this.context.font = this.font;
        this.context.fillStyle = this.color;
        this.context.fillText(`Score: ${this.playerScore}`, 10, this.height - 10);
    }

    // Drawing dead screen:
    DeadScreen() {
        this.context.fillStyle = this.deadFill;
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.font = this.deadFont;
        this.context.fillStyle = this.deadFontColor;
        this.context.fillText("YOU DIED", (this.width - this.youDiedWidth) / 2, this.height / 4);

        this.context.font = this.scoreFont;
        this.context.fillText(`score: ${this.playerScore}`, (this.width - this.scoreWidth) / 2, this.height / 2.8);
        this.context.fillText(`best-score: ${this.bestScore}`, (this.width - this.bestScoreWidth) / 2, this.height / 2.2);
        this.context.fillText("Press Enter to reset the page!", (this.width - this.enterWidth) / 2, this.height / 1.7);

        if (this.keyIsAdded) {
            document.addEventListener("keydown", (event) => {
                if (event.code == "Enter") {
                    location.reload();
                }
            });
            
            this.keyIsAdded = false;
        }
    }

    // Creat cards function:
    CreateCards() {
        this.cards = [];
        this.randomRed = Math.floor(Math.random() * this.cardsN);
        var randomDirection = Math.random() < 0.5;

        for (var i = 0; i < this.cardsN; ++i) {
            var card = new Card(this.cardWidth, this.cardHeight);
            card.isLeft = randomDirection;

            if (card.isLeft) {
                card.velocityX = this.width + (this.cardWidth * (i + 1));
            } else {
                card.velocityX = -(this.cardWidth * (i + 1));
            }

            card.velocityY = this.height - (this.cardHeight * 1.32);

            if (i == this.randomRed) {
                card.isRed = true;
                card.cardPoint = true;
            }

            this.cards.push(card);
        }
    }

    // Card behavior function:
    CardBehavior() {
        this.cards.forEach(element => {
            if (element.isLeft) {
                element.velocityX -= this.cardSpeed;
            } else {
                element.velocityX += this.cardSpeed;
            }

            element.Drawing(this.context, element.velocityX, element.velocityY);
        });
    }

    // Player behavior function:
    PlayerBehavior() {
        this.cards.forEach(element => {
            if (!element.isRed && this.ObjectsCollisionJump(this.player, element, 40) && !this.player.onCard) {
                this.player.isDead = true;
                this.player.isRun = false;
                
                this.cardSpeed = 0;
                clearInterval(this.cardsSpawn);

                this.music.pause();
            }
        });

        if (this.player.isDead) {
            this.player.velocityY -= 1;
            
            this.cards.forEach((element) => {
                element.StopAnimation();
            });

            this.kingDice.StopAnimation();
            this.sadSound.play();

            this.SetBestScore();
        } else {
            if (!this.player.onFloor && this.isStillJump) {
                this.player.velocityY -= this.jump;
    
                if (this.player.velocityY < this.maxCeiling) {
                    this.isStillJump = false;
                }
            } else {
                if (this.ObjectsCollisionJump(this.player, this.cards[this.randomRed], 20) && (this.player.velocityY < this.floor)) {
                    this.isStillJump = true;
                    this.player.onFloor = true;
                    
                    if (this.player.velocityY == (this.cards[this.randomRed].height + 10)) {
                        this.player.onCard = true;
                        this.cards[this.randomRed].playerIsOn = true;
                        this.playerScore += this.cards[this.randomRed].GetPoint();
                    } else {
                        this.player.onCard = false;
                        this.player.velocityY += this.gravity;
                    }
                } else if (this.player.velocityY < this.floor) {
                    this.player.velocityY += this.gravity;
                } else {
                    this.isStillJump = true;
                    this.player.onFloor = true;
                    this.player.onCard = false;
                }
            }

            if (this.ObjectsCollision(this.player, this.cards[this.randomRed]) && (this.player.velocityX > this.minArea) && (this.player.velocityX < this.maxArea)) {
                if (this.cards[this.randomRed].isLeft) {
                    if (this.player.onCard) {
                        this.player.velocityX -= this.cardSpeed;
                    } else if (this.player.velocityX < this.cards[this.randomRed].velocityX) {
                        this.player.velocityX -= this.cardSpeed;
                    }
                } else {
                    if (this.player.onCard) {
                        this.player.velocityX += this.cardSpeed;
                    } else if (this.player.velocityX > this.cards[this,this.randomRed].velocityX) {
                        this.player.velocityX += this.cardSpeed;
                    }
                }
            }
            
            if ((this.player.isRun && this.player.isLeft) && (this.player.velocityX > this.minArea)) {
                if (this.player.onCard) {
                    this.player.velocityX -= this.speed;
                } else if (this.ObjectsCollision(this.player, this.cards[this.randomRed]) && (this.player.velocityX < this.cards[this.randomRed].velocityX)) {
                    this.player.velocityX -= this.speed;
                } else if (!this.ObjectsCollision(this.player, this.cards[this.randomRed])) {
                    this.player.velocityX -= this.speed;
                }
            } else if ((this.player.isRun && !this.player.isLeft) && (this.player.velocityX < this.maxArea)) {
                if (this.player.onCard) {
                    this.player.velocityX += this.speed;
                } else if (this.ObjectsCollision(this.player, this.cards[this.randomRed]) && (this.player.velocityX > this.cards[this.randomRed].velocityX)) {
                    this.player.velocityX += this.speed;
                } else if (!this.ObjectsCollision(this.player, this.cards[this.randomRed])) {
                    this.player.velocityX += this.speed;
                }
            }
        }
        
        this.player.Drawing(this.context, this.player.velocityX, this.player.velocityY);

        if (this.player.isDead) {
            this.DeadScreen();
        }
    }

    // Drawing function:
    Drawing() {
        this.context.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
        this.kingDice.Drawing(this.context, this.kingDiceX, this.kingDiceY);

        this.DrawingScore();
        this.CardBehavior();
        this.PlayerBehavior();

        this.context.drawImage(this.backgroundChips, this.chipsX, this.chipsY, this.chipsWidth, this.chipsHeight);
    }
}
