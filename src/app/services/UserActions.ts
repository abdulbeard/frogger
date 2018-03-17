export class UserActions {
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

    //move
    up(bounds_check, game) {
        if (bounds_check(game.posX, game.posY - 30, game)) {
            game.posY -= 30;
            game.current++;
        }
        if (game.current > game.highest) {
            game.score += 10;
            game.highest++;
        }
        game.facing = 'u';
    };

    down(bounds_check, game) {
        if (bounds_check(game.posX, game.posY + 30, game)) {
            game.posY += 30;
            game.current--;
        }
        game.facing = 'd';
    };

    left(bounds_check, game) {
        if (bounds_check(game.posX - 30, game.posY, game)) game.posX -= 30;
        game.facing = 'l';
    };

    right(bounds_check, game) {
        if (bounds_check(game.posX + 30, game.posY, game)) game.posX += 30;
        game.facing = 'r';
    };
}