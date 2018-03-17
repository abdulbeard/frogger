import { Car } from "../models/Car";
import { Log } from "../models/Log";

export class GameSetup {

    // object initializers - cars, logs
    make_cars(rows: Array<number>): Array<Car> {
        return [
            this.make_car(rows, 0),
            this.make_car(rows, 0, 130, 3),
            this.make_car(rows, 0, 260, 3),
            this.make_car(rows, 1),
            this.make_car(rows, 2),
            this.make_car(rows, 2, 150, 0),
            this.make_car(rows, 3, 200),
            this.make_car(rows, 4),
            this.make_car(rows, 5),
            this.make_car(rows, 5, 80),
            this.make_car(rows, 5, 240)
        ];
    };

    make_car(rows, row?, x?, model?) {
        switch (row) {
            case 0:
                return new Car(x == null ? -25 : x, rows[row], row, 3, model == null ? 1 : model);
            case 1:
                return new Car(x == null ? 399 : x, rows[row], row, 2, model == null ? 0 : model);
            case 2:
                return new Car(x == null ? 399 : x, rows[row], row, 4, model == null ? 2 : model);
            case 3:
                return new Car(x == null ? -25 : x, rows[row], row, 3, model == null ? 3 : model);
            case 4:
                return new Car(x == null ? 399 : x, rows[row], row, 3, model == null ? 0 : model);
            case 5:
                return new Car(x == null ? 399 : x, rows[row], row, 4, model == null ? 4 : model);
        }
    };

    make_logs(rows: Array<number>): Array<Log> {
        return [
            this.make_log(rows, 7),
            this.make_log(rows, 7, 170),
            this.make_log(rows, 8),
            this.make_log(rows, 8, 200),
            this.make_log(rows, 9),
            this.make_log(rows, 10),
            this.make_log(rows, 11),
            this.make_log(rows, 11, 100, 0),
            this.make_log(rows, 12)
        ];
    };

    make_log(rows, row?, x?, len?) {
        switch (row) {
            case 7:
                return new Log(x == null ? 399 : x, rows[row], row, 1, 1, len == null ? 1 : len);
            case 8:
                return new Log(x == null ? -85 : x, rows[row], row, 4, -1, len == null ? 2 : len);
            case 9:
                return new Log(x == null ? 399 : x, rows[row], row, 2, 1, len == null ? 0 : len);
            case 10:
                return new Log(x == null ? -85 : x, rows[row], row, 2, -1, len == null ? 1 : len);
            case 11:
                return new Log(x == null ? 399 : x, rows[row], row, 3, 1, len == null ? 1 : len);
            case 12:
                return new Log(x == null ? -85 : x, rows[row], row, 3, -1, len == null ? 2 : len);
        }
    };
}