import { VehicleLengths } from "./VehicleLengths";

export class Log {
    /* Log lengths:
*   0: long
*   1: medium
*   2: small
*/

    posX: number;
    posY: number;
    row: number;
    speed: number;
    dir: number;
    length: number;
    width: number;
    height: number;

    constructor(x, y, row, speed, dir, length) {
        this.posX = x;
        this.posY = y;
        this.row = row;
        this.speed = speed;
        this.dir = dir;
        this.length = length;
        this.width = VehicleLengths.Lengths[length].width;
        this.height = VehicleLengths.Lengths[length].height;
    }
    move = function () {
        this.posX = this.posX - (this.dir * this.speed);
    }
    draw(context: CanvasRenderingContext2D, sprites: HTMLImageElement) {
        switch (this.length) {
            case 0:
                context.drawImage(sprites, 6, 165, 179, 21, this.posX, this.posY, 179, 21);
                break;
            case 1:
                context.drawImage(sprites, 5, 197, 118, 21, this.posX, this.posY, 118, 21);
                break;
            case 2:
                context.drawImage(sprites, 6, 229, 85, 22, this.posX, this.posY, 85, 22);
                break;
        }
    }
    out_of_bounds() {
        return ((this.posX + this.width) < 0 || this.posX > 399);
    }
}