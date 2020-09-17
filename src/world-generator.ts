import {Direction, SmartTile, Tile} from "./maze";

///
/// Interfaces
///

export interface TilesSummary {
    tiles: Tile[];
    rowSize: number; // todo: remove;
    startTile: Tile; // todo: remove
    endTile: Tile; // todo: remove
}


export interface World {
    start: number;
    end: number;
    mazeTiles: SmartTile[];
}


export class WorldGenerator {


    /**
     * Returns Graph representing a world with traversable paths
     */
    createWorld = (columns: number, rows: number, pathPercent: number): World => {
        const area = columns * rows;


        // what the world is made up of.
        const tiles = this.generateTiles(columns, rows, pathPercent);

        return this.createGraphFromMaze(tiles);

    }


    /**
     * Returns list of randomly generated tiles
     *
     * @param columns
     * @param rows
     * @param pathPercent number between 0 and 1
     */
    generateTiles(columns: number, rows: number, pathPercent: number): TilesSummary {
        const tiles: Tile[] = [];
        const area = columns * rows;

        const obstacleLocations = {};

        const numberOfObstacles = Math.floor(area * pathPercent);
        // create obstacles

        this.generatePaths(tiles, numberOfObstacles, area);
        this.generateRocks(tiles, numberOfObstacles, area);

        // create start
        const start = Math.floor(Math.random() * area);
        tiles[start].type = 'START';


        console.log('start', start);


        const end = Math.floor(Math.random() * area);
        tiles[end].type = 'END';

        console.log('end', end);

        // array of size column by row
        return {
            rowSize: rows,
            tiles: tiles,
            startTile: tiles[start],
            endTile: tiles[end],
        }
    }

    generatePaths(tiles: Tile[], numberOfObstacles: number, area: number) {
        for ( let i = 0; i < area; i++) {
            tiles.push({ type: 'PATH'});
        }
    }

    generateRocks(tiles: Tile[], numberOfObstacles: number, area: number) {
        for (let i = 0; i < numberOfObstacles; i++) {
            const location = Math.floor(Math.random() * area);

            tiles[location].type = 'ROCK';
        }
    }

    ///
    ///
    ///

    public createGraphFromMaze = (tilesSummary: TilesSummary) : World => {
        const mazeTiles: SmartTile[] = [];

        let start = 0;
        let end = 0;


        for (let i = 0; i < tilesSummary.tiles.length; i++) {

            const details: SmartTile = {
                paths: [],
                position: i,
                type: tilesSummary.tiles[i].type,
            };

            mazeTiles.push(details);

            if (details.type != 'PATH') {
                continue; // continue if this is not a path since it should not have any connections
            }

            ['⭠', '⭢', '⭡', '⭣'].forEach((direction: Direction) => {
                let position = this.getPosition(tilesSummary, i, direction);
                if (position != null && tilesSummary.tiles[position].type != 'ROCK') {

                    if (tilesSummary.tiles[position].type === 'START') {
                        start = i;
                    }

                    if (tilesSummary.tiles[position].type === 'END') {
                        end = i;
                    }

                    details.paths.push(position);
                }
            });

        }

        return {
            start, end, mazeTiles
        };

        // return mazeGraph;
    }

    /**
     * Gets position if valid, otherwise returns null
     *
     * @param maze
     * @param direction
     * @param currentPosition
     */
    private getPosition = (tilesSummary: TilesSummary, currentPosition: number, direction: Direction ) => {
        switch (direction) {
            case '⭠': {
                return currentPosition % tilesSummary.rowSize > 0
                    ? currentPosition - 1
                    : null;
            }
            case '⭢': {
                return currentPosition < tilesSummary.tiles.length -1 && currentPosition % tilesSummary.rowSize < tilesSummary.rowSize - 1
                    ? currentPosition + 1
                    : null;
            }
            case '⭡': {
                return currentPosition - tilesSummary.rowSize < 0 ? null : currentPosition - tilesSummary.rowSize;
            }
            case '⭣': {
                return currentPosition +tilesSummary.rowSize > tilesSummary.tiles.length -1 ? null : currentPosition + tilesSummary.rowSize;
            }
        }
    }



}