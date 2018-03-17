export class Game {
    lives: number;
    extra: number;
    level: number;
    score: number;
    posX: number;
    posY: number;
    facing: string;
    log: number;
    current: number;
    highest: number;
    dead: number;
    win: number;
    won: Array<any>;

    constructor() {
        this.lives = 5;
        this.extra = 0;
        this.level = 1;
        this.score = 0;
        this.posX = 187;
        this.posY = 503;
        this.facing = 'u';
        this.log = -1;
        this.current = -1;
        this.highest = -1;
        this.dead = -1;
        this.win = -1;
        this.won = [false, false, false, false, false];
    }
    reset() {
        this.posY = 503;
        this.posX = 187;
        this.facing = 'u';
        this.log = -1;
        this.current = -1;
        this.highest = -1;
        this.dead = -1;
        this.win = -1;
    }
}
