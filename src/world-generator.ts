import {SmartTile, Tile} from "./tile";

///
/// Interfaces/ Types
///

/**
 * The world and its contents
 */
export interface World {
    // the number of columns that make up this world
    columns: number;

    // the number of rows that make up this world
    rows: number;

    // index of the start position
    start: number;

    // index of the end position
    end: number;

    // all the tiles that make up the world, ordered by their position
    tiles: SmartTile[];
}

/**
 * Describes how to travel within this world
 */
export type Direction = '⭠' | '⭢' | '⭡' | '⭣';

///
/// Classes
///

export class WorldGenerator {

    ///
    /// Public Methods
    ///


    /**
     * Randomly generates paths, obstacles, start, and end tiles to create the World
     */
    generateWorld(columns: number, rows: number, pathPercent: number): World {
        const tiles = this.generateTiles(columns * rows, pathPercent);
        return this.createConnectedWorld(tiles, columns, rows);
    }

    ///
    /// Private Methods
    ///

    /**
     * Returns list of randomly generated tiles
     *
     * @param numberOfTiles
     * @param pathPercent number between 0 and 1
     */
    private generateTiles(numberOfTiles: number, pathPercent: number): Tile[] {
        const numberOfObstacles = Math.floor(numberOfTiles * pathPercent);

        const tiles = this.generatePaths(numberOfTiles);
        this.generateRocks(tiles, numberOfObstacles);

        // randomly place the start tile
        const start = Math.floor(Math.random() * numberOfTiles);
        tiles[start].type = 'START';

        // randomly places the end tile
        // just in case end and start are the same value, just move end a few steps over
        // making sure it wraps if it would be out of bounds
        let end = Math.floor(Math.random() * numberOfTiles);
        end = end == start ? (end + 3) % numberOfTiles : end;
        tiles[end].type = 'END';

        // array of size column by row
        return tiles;
    }

    /**
     * Returns list of path tiles
     *
     * @param numberOfPaths number of paths to be returned
     */
    private generatePaths(numberOfPaths: number): Tile[]{
        const tiles: Tile[] = [];

        for ( let i = 0; i < numberOfPaths; i++) {
            tiles.push({ type: 'PATH'});
        }

        return tiles;
    }

    /**
     * Randomly replaces tiles with 'ROCK's
     *
     * @param tiles array where the obstacles will be inserted
     * @param numberOfObstacles max number of obstacles to insert; collisions might make it less but never more
     */
    private generateRocks(tiles: Tile[], numberOfObstacles: number) {
        for (let i = 0; i < numberOfObstacles; i++) {
            // technically rocks could land on the same spot but that is fine since it will
            // still have the random factor
            const location = Math.floor(Math.random() * (tiles.length - 1));

            tiles[location].type = 'ROCK';
        }
    }

    /**
     * Analyses tiles, and creates a World with traversable paths
     *
     * @param tiles the tiles that make up the world
     * @param columns the number of columns that make up this world
     * @param rows the number of rows that make up this world
     *
     * @returns the World where tiles are aware of their traversable neighbors
     */
    private createConnectedWorld(tiles: Tile[], columns: number, rows: number): World {
        const smartTiles: SmartTile[] = [];

        let start = 0;
        let end = 0;

        for (let i = 0; i < tiles.length; i++) {

            const details: SmartTile = {
                paths: [],
                position: i,
                type: tiles[i].type,
            };

            smartTiles.push(details);

            if (details.type === 'ROCK') {
                // 'ROCK's are never traversable so they should not hold path information
                continue;
            } else if (details.type === 'START') {
                start = i;
            } else if (details.type === 'END') {
                end = i;
            }

            // Here determine which tiles are immediately accessible from the current tile
            // The array with arrows describes the order/direction in which the the algorithm will insert a valid path.
            ['⭠', '⭡', '⭢', '⭣'].forEach((direction: Direction) => {
                let position = this.getPosition(tiles, rows, i, direction);

                // since rocks are not traversable they should never be part of any path
                if (position != null && tiles[position].type != 'ROCK') {
                    details.paths.push(position);
                }
            });
        }

        return {
            columns: columns,
            rows: rows,
            tiles: smartTiles,
            start: start,
            end: end
        };
    }

    /**
     * Given current position in the 'World', returns position of the
     *
     * @param tiles all of the tiles that make up the world
     * @param rows the number of rows that make up this world
     * @param direction the direction in which to search for neighboring tile
     * @param currentPosition the index of the tile whose neighbors we want to discover
     */
    private getPosition(tiles: Tile[], rows: number, currentPosition: number, direction: Direction ) {
        switch (direction) {
            case '⭠': {
                return currentPosition % rows > 0
                    ? currentPosition - 1
                    : null;
            }
            case '⭢': {
                return currentPosition < tiles.length - 1 && currentPosition % rows < rows - 1
                    ? currentPosition + 1
                    : null;
            }
            case '⭡': {
                return currentPosition - rows < 0 ? null : currentPosition - rows;
            }
            case '⭣': {
                return currentPosition + rows > tiles.length - 1 ? null : currentPosition + rows;
            }
        }
    }

}