import image from "./image.js";

export default class SpriteAnimation {
    images = [];
    imageIndex = 0;

    constructor(fileName, numberOfImage, timerCount) {
        this.timerCount = timerCount;
        this.timerCountDefault = timerCount;

        for (let i = 1; i <= numberOfImage; ++i) {
            this.images.push(image(fileName.replace("?", i)));
        }
    }

    // Reset animation function:
    Reset() {
        this.imageIndex = 0;
    }

    // Stop animation function:
    Stop() {
        this.timerCountDefault = 0;
    }

    // Get image function:
    GetImage() {
        this.SetImageIndex();
        return this.images[this.imageIndex];
    }

    // Set image function:
    SetImageIndex() {
        this.timerCount -= 1;

        if (this.timerCount == 0) {
            this.imageIndex += 1;
            this.timerCount = this.timerCountDefault;

            if (this.imageIndex >= this.images.length) {
                this.imageIndex = 0;
            }
        } 
    }
}
