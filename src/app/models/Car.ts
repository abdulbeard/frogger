import { VehicleModels } from "./VehicleModels";

/* game "classes" - game, car, log
* Car models:
*   0: pink sedan
*   1: white sedan
*   2: yellow sedan
*   3: white bulldozer
*   4: white truck
*/

export class Car {
    posX: number;
    posY: number;
    lane: number;
    speed: number;
    model: number;
    width: number;
    height: number;
    move(level: number) {
        this.posX = this.posX - (VehicleModels.Models[this.model].dir * this.speed * level);
    };
    draw(context: CanvasRenderingContext2D, sprites: HTMLImageElement) {
        switch (this.model) {
            case 0:
                context.drawImage(sprites, 8, 265, 30, 22, this.posX, this.posY, 30, 22);
                break;
            case 1:
                context.drawImage(sprites, 45, 264, 29, 24, this.posX, this.posY, 29, 24);
                break;
            case 2:
                context.drawImage(sprites, 81, 263, 24, 26, this.posX, this.posY, 24, 26);
                break;
            case 3:
                context.drawImage(sprites, 9, 300, 24, 21, this.posX, this.posY, 24, 21);
                break;
            case 4:
                context.drawImage(sprites, 105, 301, 46, 19, this.posX, this.posY, 46, 19);
                break;
        }
    };
    out_of_bounds() {
        return ((this.posX + this.width) < 0 || this.posX > 399);
    };

    constructor(x, y, lane, speed, model) {
        this.posX = x;
        this.posY = y;
        this.lane = lane;
        this.speed = speed;
        this.model = model;
        this.width = VehicleModels.Models[this.model].width;
        this.height = VehicleModels.Models[this.model].height;
    }
}