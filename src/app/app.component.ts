import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { Log } from './models/Log';
import { Car } from './models/Car';
import { Game } from './models/Game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.board = <HTMLCanvasElement>document.getElementById('game');
    console.log(this.board);
    this.context = this.board.getContext('2d');
  }
  ngOnInit(): void {
    this.start_game();
    setInterval(() => { this.game_loop(); }, 50);
  }
  title = 'app';

  constructor() {
    this.models = [
      { width: 30, height: 22, dir: 1 },
      { width: 29, height: 24, dir: -1 },
      { width: 24, height: 26, dir: 1 },
      { width: 24, height: 21, dir: -1 },
      { width: 46, height: 19, dir: 1 }
    ];
    this.lengths = [{ width: 179, height: 21 }, { width: 118, height: 21 }, { width: 85, height: 22 }];
    this.rows = [473, 443, 413, 383, 353, 323, 288, 261, 233, 203, 173, 143, 113];
    this.game = new Game();
    this.theme = document.createElement('audio');
    this.theme.setAttribute('src', 'assets/frogger.mp3');
    this.theme.setAttribute('loop', 'true');
    this.theme.play();
    this.logs = null;
    this.cars = null;
    this.sprites = new Image();
    this.deadsprite = new Image();
  }

  models = [];
  lengths = [];
  rows = [];
  game = null;
  board = null;
  context = null;
  theme = null;
  highscore: number;
  logs = null;
  cars = null;

  sprites = null;
  deadsprite = null;

  start_game() {
    this.game = new Game();
    $(document).keydown((e) => {
      var arrow_key = this.get_arrow_key(e);
      if (arrow_key) {
        e.preventDefault();
      }
      if (this.game.dead === -1 && this.game.lives > 0) {
        if (arrow_key === 'u') {
          this.up();
        } else if (arrow_key === 'd') {
          this.down();
        } else if (arrow_key === 'l') {
          this.left();
        } else if (arrow_key === 'r') {
          this.right();
        }
      }
    });
    // this.board = document.getElementById('game');
    // this.context = this.board.getContext('2d');
    // this.theme = document.createElement('audio');
    // this.theme.setAttribute('src', 'assets/frogger.mp3');
    // this.theme.setAttribute('loop', 'true');
    // this.theme.play();
    // this.sprites = new Image();
    // this.deadsprite = new Image();
    this.sprites.src = 'assets/frogger_sprites.png';
    this.deadsprite.src = 'assets/dead_frog.png';
    this.sprites.onload = (() => {
      this.draw_bg();
      this.draw_info();
      this.make_cars();
      this.make_logs();
      this.draw_frog();
    });
  };

  game_loop() {
    this.draw_bg();
    this.draw_info();
    this.draw_cars();
    this.draw_logs();
    this.draw_wins();
    if (this.game.lives > 0) {
      this.draw_frog();
    } else {
      this.game_over();
    }
  };


  get_arrow_key(e) {
    /* 
    Args:
        e -- event
  
    Returns: the name of the arrow key that was pressed when a key is pressed or null.
    */
    switch (e.keyCode) {
      case 37:
        return 'l';
      case 38:
        return 'u';
      case 39:
        return 'r';
      case 40:
        return 'd';
    }
    return null;
  };

  //drawer functions: bg, info, frogger, cars, logs, wins
  draw_bg() {
    this.context.fillStyle = '#191970';
    this.context.fillRect(0, 0, 399, 284);
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 284, 399, 283);
    this.context.drawImage(this.sprites, 0, 0, 399, 113, 0, 0, 399, 113);
    this.context.drawImage(this.sprites, 0, 119, 399, 34, 0, 283, 399, 34);
    this.context.drawImage(this.sprites, 0, 119, 399, 34, 0, 495, 399, 34);
  };

  draw_info() {
    this.draw_lives();
    this.context.font = 'bold 14pt arial';
    this.context.fillStyle = '#00EE00';
    this.context.fillText('Level ', 74, 545);
    this.draw_level();
    this.context.font = 'bold 10pt arial';
    this.context.fillText('Score: ', 4, 560);
    this.context.fillText('Highscore: ', 200, 560);
    this.draw_score();
  };

  draw_lives() {
    var x = 4;
    var y = 532;
    if ((this.game.score - (this.game.extra * 10000)) >= 10000 && this.game.lives < 4) {
      this.game.extra++;
    }
    for (var i = 0; i < (this.game.lives + this.game.extra); i++) {
      this.context.drawImage(this.sprites, 13, 334, 17, 23, x, y, 11, 15);
      x += 14;
    }
  };

  draw_level() {
    this.context.font = 'bold 15pt arial';
    this.context.fillStyle = '#00EE00';
    this.context.fillText(this.game.level, 131, 545);
  };

  draw_score() {
    this.context.font = 'bold 10pt arial';
    this.context.fillStyle = '#00EE00';
    this.context.fillText(this.game.score, 49, 560);
    if (window.localStorage['highscore']) {
      this.highscore = localStorage['highscore'];
    } else this.highscore = 0;
    this.context.fillText(this.highscore.toString(), 272, 560);
  };

  draw_frog() {
    this.game.log = this.log_collision();
    if (this.game.dead > 0) {
      // @4,2 ; 19x24
      this.context.drawImage(this.deadsprite, 4, 2, 19, 24, this.game.posX, this.game.posY, 19, 24);
      this.game.dead--;
    }
    else if (this.game.dead === 0) {
      this.game.reset();
    }
    else if (this.game.win > 0) {
      this.game.win--;
    }
    else if (this.game.win === 0) {
      this.game.reset();
    }
    else if (this.car_collision()) {
      this.sploosh();
    }
    else if (this.water_collision() && this.game.log === -1) {
      this.sploosh();
    }
    else if (this.check_win()) {
      this.win();
    }
    else {
      if (this.game.log >= 0) {
        var tempX = this.game.posX - (this.logs[this.game.log].dir * this.logs[this.game.log].speed);
        if (this.bounds_check(tempX, this.game.posY)) {
          this.game.posX = tempX;
        }
      }
      if (this.game.facing === 'u') {
        this.context.drawImage(this.sprites, 12, 369, 23, 17, this.game.posX, this.game.posY, 23, 17);
        this.game.width = 23, this.game.height = 17;
      }
      else if (this.game.facing === 'd') {
        this.context.drawImage(this.sprites, 80, 369, 23, 17, this.game.posX, this.game.posY, 23, 17);
        this.game.width = 23, this.game.height = 17;
      }
      else if (this.game.facing === 'l') {
        this.context.drawImage(this.sprites, 80, 335, 19, 23, this.game.posX, this.game.posY, 19, 23);
        this.game.width = 19, this.game.height = 23;
      }
      else if (this.game.facing === 'r') {
        this.context.drawImage(this.sprites, 12, 335, 19, 23, this.game.posX, this.game.posY, 19, 23);
        this.game.width = 19, this.game.height = 23;
      }
    }
  };

  draw_wins() {
    for (var i = 0; i < this.game.won.length; i++) {
      if (this.game.won[i]) {
        switch (i) {
          case 0:
            this.context.drawImage(this.sprites, 80, 369, 23, 17, 15, 80, 23, 17);
            break;
          case 1:
            this.context.drawImage(this.sprites, 80, 369, 23, 17, 101, 80, 23, 17);
            break;
          case 2:
            this.context.drawImage(this.sprites, 80, 369, 23, 17, 187, 80, 23, 17);
            break;
          case 3:
            this.context.drawImage(this.sprites, 80, 369, 23, 17, 270, 80, 23, 17);
            break;
          case 4:
            this.context.drawImage(this.sprites, 80, 369, 23, 17, 354, 80, 23, 17);
            break;
        }
      }
    }
  };

  draw_cars() {
    for (var i = 0; i < this.cars.length; i++) {
      this.cars[i].move(this.game.level);
      if (this.cars[i].out_of_bounds()) {
        this.cars[i] = this.make_car(this.cars[i].lane, null, this.cars[i].model);
      }
      this.cars[i].draw(this.context, this.sprites);
    }
  };

  draw_logs() {
    for (var i = 0; i < this.logs.length; i++) {
      this.logs[i].move();
      if (this.logs[i].out_of_bounds()) {
        this.logs[i] = this.make_log(this.logs[i].row)
      }
      this.logs[i].draw(this.context, this.sprites);
    }
  };

  game_over() {
    this.context.font = 'bold 72pt arial';
    this.context.fillStyle = '#FFFFFF';
    this.context.fillText('GAME', 60, 150);
    this.context.fillText('OVER', 60, 300);
    if (this.game.score >= this.highscore) {
      localStorage['highscore'] = this.game.score;
      this.context.font = 'bold 48pt arial';
      this.context.fillStyle = '#00EE00';
      this.context.fillText('YOU GOT A', 20, 380);
      this.context.fillText('HIGHSCORE', 6, 460);
    }
  };


  //move
  up() {
    if (this.bounds_check(this.game.posX, this.game.posY - 30)) {
      this.game.posY -= 30;
      this.game.current++;
    }
    if (this.game.current > this.game.highest) {
      this.game.score += 10;
      this.game.highest++;
    }
    this.game.facing = 'u';
  };

  down() {
    if (this.bounds_check(this.game.posX, this.game.posY + 30)) {
      this.game.posY += 30;
      this.game.current--;
    }
    this.game.facing = 'd';
  };

  left() {
    if (this.bounds_check(this.game.posX - 30, this.game.posY)) this.game.posX -= 30;
    this.game.facing = 'l';
  };

  right() {
    if (this.bounds_check(this.game.posX + 30, this.game.posY)) this.game.posX += 30;
    this.game.facing = 'r';
  };


  bounds_check(x, y) {
    if (y > 90 && y < 510 && x > 0 && x < 369) {
      return true;
    }
    else if (y > 60 && y < 100 && ((x > 5 && x < 40 && !this.game.won[0]) ||
      (x > 92 && x < 128 && !this.game.won[1]) || (x > 178 && x < 214 && !this.game.won[2]) ||
      (x > 263 && x < 299 && !this.game.won[3]) || (x > 347 && x < 383 && !this.game.won[4]))) {
      return true;
    }
    return false;
  };

  check_win() {
    if (this.game.posY > 60 && this.game.posY < 100) {
      if (this.game.posX > 5 && this.game.posX < 40 && !this.game.won[0]) {
        this.game.won[0] = true;
        return true;
      } else if (this.game.posX > 92 && this.game.posX < 128 && !this.game.won[1]) {
        this.game.won[1] = true;
        return true;
      } else if (this.game.posX > 178 && this.game.posX < 214 && !this.game.won[2]) {
        this.game.won[2] = true;
        return true;
      } else if (this.game.posX > 263 && this.game.posX < 299 && !this.game.won[3]) {
        this.game.won[3] = true;
        return true;
      } else if (this.game.posX > 347 && this.game.posX < 383 && !this.game.won[4]) {
        this.game.won[4] = true;
        return true;
      }
    }
    return false;
  };

  win() {
    this.game.score += 50;
    this.game.win = 15;
    if (this.game.won[0] && this.game.won[1] && this.game.won[2] && this.game.won[3] && this.game.won[4]) {
      this.level();
    }
  };

  level() {
    for (var i = 0; i < this.game.won.length; i++) {
      this.game.won[i] = false;
    }
    this.game.score += 1000;
    this.game.level++;
  };

  collides(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (((x1 <= x2 + w2 && x1 >= x2) && (y1 <= y2 + h2 && y1 >= y2)) ||
      ((x1 + w1 <= x2 + w2 && x1 + w1 >= x2) && (y1 <= y2 + h2 && y1 >= y2)) ||
      ((x1 <= x2 + w2 && x1 >= x2) && (y1 + h1 <= y2 + h2 && y1 + h1 >= y2)) ||
      ((x1 + w1 <= x2 + w2 && x1 + w1 >= x2) && (y1 + h1 <= y2 + h2 && y1 + h1 >= y2)));
  }

  car_collision() {
    if (this.game.posY < 505 && this.game.posY > 270) {
      for (var i = 0; i < this.cars.length; i++) {
        if (this.collides(
          this.game.posX,
          this.game.posY,
          this.game.width,
          this.game.height,
          this.cars[i].posX,
          this.cars[i].posY,
          this.cars[i].width,
          this.cars[i].height)) {
          return true;
        }
      }
    }
    return false;
  };

  log_collision() {
    if (this.game.posY < 270) {
      for (var i = 0; i < this.logs.length; i++) {
        if (this.collides(this.game.posX, this.game.posY, this.game.width, this.game.height, this.logs[i].posX, this.logs[i].posY, this.logs[i].width, this.logs[i].height)) return i;
      }
    }
    return -1;
  };

  water_collision() {
    return (this.game.posY > 105 && this.game.posY < 270);
  };

  sploosh() {
    this.game.lives--;
    this.game.dead = 20;
  };

  // object initializers - cars, logs
  make_cars() {
    this.cars = [
      this.make_car(0),
      this.make_car(0, 130, 3),
      this.make_car(0, 260, 3),
      this.make_car(1),
      this.make_car(2),
      this.make_car(2, 150, 0),
      this.make_car(3, 200),
      this.make_car(4),
      this.make_car(5),
      this.make_car(5, 80),
      this.make_car(5, 240)
    ];
  };

  make_car = function (row?, x?, model?) {
    switch (row) {
      case 0:
        return new Car(x == null ? -25 : x, this.rows[row], row, 3, model == null ? 1 : model);
      case 1:
        return new Car(x == null ? 399 : x, this.rows[row], row, 2, model == null ? 0 : model);
      case 2:
        return new Car(x == null ? 399 : x, this.rows[row], row, 4, model == null ? 2 : model);
      case 3:
        return new Car(x == null ? -25 : x, this.rows[row], row, 3, model == null ? 3 : model);
      case 4:
        return new Car(x == null ? 399 : x, this.rows[row], row, 3, model == null ? 0 : model);
      case 5:
        return new Car(x == null ? 399 : x, this.rows[row], row, 4, model == null ? 4 : model);
    }
  };

  make_logs() {
    this.logs = [
      this.make_log(7),
      this.make_log(7, 170),
      this.make_log(8),
      this.make_log(8, 200),
      this.make_log(9),
      this.make_log(10),
      this.make_log(11),
      this.make_log(11, 100, 0),
      this.make_log(12)
    ];
  };

  make_log(row?, x?, len?) {
    switch (row) {
      case 7:
        return new Log(x == null ? 399 : x, this.rows[row], row, 1, 1, len == null ? 1 : len);
      case 8:
        return new Log(x == null ? -85 : x, this.rows[row], row, 4, -1, len == null ? 2 : len);
      case 9:
        return new Log(x == null ? 399 : x, this.rows[row], row, 2, 1, len == null ? 0 : len);
      case 10:
        return new Log(x == null ? -85 : x, this.rows[row], row, 2, -1, len == null ? 1 : len);
      case 11:
        return new Log(x == null ? 399 : x, this.rows[row], row, 3, 1, len == null ? 1 : len);
      case 12:
        return new Log(x == null ? -85 : x, this.rows[row], row, 3, -1, len == null ? 2 : len);
    }
  };
}