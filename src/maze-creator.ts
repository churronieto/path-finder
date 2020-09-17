import {Maze} from "./maze-solver";
import {MazeTile} from "./maze";

export class MazeCreator {


    /**
     *
     * @param columns
     * @param rows
     * @param pathPercent number between 0 and 1
     */
    createMaze(columns: number, rows: number, pathPercent: number): Maze {
        const tiles: MazeTile[] = [];
        const area = columns * rows;

        const obstacleLocations = {};

        const numberOfObstacles = Math.floor(area * pathPercent);
        // create obstacles

        for ( let i = 0; i < area; i++) {
            tiles.push({ type: 'PATH'});
        }

        for (let i = 0; i < numberOfObstacles; i++) {
            const location = Math.floor(Math.random() * area);

            tiles[location].type = 'ROCK';
        }


        // array of size column by row
        return {
            rowSize: rows,
            tiles: tiles
        }

    }


}