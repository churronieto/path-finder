import {Direction, SmartTile} from "./maze";
import {Queue} from "./queue";
import {TilesSummary, World} from "./world-generator";

///
/// Interfaces
///

interface MapSolverLogs {
    traversalPath: SmartTile[]
}

interface PathDetail {
    // a path that between "from" and "to"
    route: SmartTile[],

    // all visited paths in the order in which they were visited
    pathsVisited: SmartTile[]
}

///
/// Classes
///

export class PathFinder {
    // original maze, no directional information
    private tileSummary;

    // maze with direction information
    private detailedMaze: World;


    private logs: MapSolverLogs = {
        // .length is the max stack size,
        // array contains path taken by algorithm
        traversalPath: []
    }

    constructor(tilesSummary: TilesSummary) {
        this.tileSummary = tilesSummary;

        // create once and reuse
        this.detailedMaze = this.createGraphFromMaze();
    }

    /**
     * Returns the path taken to get "from" point A "to" point b
     * @param maze
     * @param from
     * @param to
     */
    findPath = (): PathDetail => {

        const route: SmartTile[] =  [];

        // reset logs
        this.resetLogs();

        // verify that the 'to' and 'from' are actual paths in the maze otherwise there would never be a solution
        // if ( this.detailedMaze.start && this.detailedMaze.mazeTiles[from].type === 'PATH' &&
        //     this.detailedMaze.end && this.detailedMaze.mazeTiles[to].type === 'PATH') {
            const queue = new Queue<number>();
            queue.offer(this.detailedMaze.start);

            this.composePath(queue,
                {},
                this.detailedMaze.mazeTiles,
                this.detailedMaze.end,
                route);
        // }

        return {
            route,
            pathsVisited: this.logs.traversalPath
        };
    }

    private resetLogs() {
        this.logs = {
            traversalPath: []
        };
    }

    /**
     * Returns the last node connected to the path
     *
     * @param traversalQueue
     * @param visited
     * @param detailedMaze
     * @param to
     * @param result
     */
    private composePath = (traversalQueue: Queue<number>,
                         visited: any,
                         detailedMaze : SmartTile[],
                         to: number,
                         result: SmartTile[]): number => {

        // console.log('traversalQueue                     ', traversalQueue.toArray());
        // console.log('visited                     ', {...visited});

        // we have inspecting everything we could, queue is empty so lets get out
        if (traversalQueue.isEmpty()) {
            return; // in this situation nothing matched so we are done.
        }

        // there is at least one thing in the queue.
        const current = traversalQueue.poll();

        // order in which the graph was traversed;
        this.logs.traversalPath.push(detailedMaze[current]);

        // record this as a visited node.

        // found a match add it and get go back
        if (current === to) {
            result.push(detailedMaze[current]);
            return current; // return the node that last matched.
        }

        // todo: sometimes there is no path at the starting node for some reason...
        detailedMaze[current].paths.forEach((tile) => {


            // if it has not been visited yet then add it to the queue
            if (visited[tile] == null) {
                traversalQueue.offer(tile);
                visited['' + tile] = tile;
            }
        });


        // we either found it which should be a path, or not witch should not be a path.
        let previousPathToSolution = this.composePath(traversalQueue, visited, detailedMaze, to, result);

        if (previousPathToSolution != null) {


            // if this last path is connected to the current path, the current path now becomes the new previousPath;

            // we found the path but need to make sure it is related to the next one up

            if (detailedMaze[previousPathToSolution].paths.includes(current)) {
                result.push(detailedMaze[current]);
                return current;
            }
        }

        return previousPathToSolution;
    }

    private createGraphFromMaze = () : World => {
        const mazeTiles: SmartTile[] = [];

        let start = 0;
        let end = 0;


        for (let i = 0; i < this.tileSummary.tiles.length; i++) {

            const details: SmartTile = {
                paths: [],
                position: i,
                type: this.tileSummary.tiles[i].type,
            };

            mazeTiles.push(details);

            if (details.type != 'PATH') {
                continue; // continue if this is not a path since it should not have any connections
            }

            ['⭠', '⭢', '⭡', '⭣'].forEach((direction: Direction) => {
                let position = this.getPosition(i, direction);
                if (position != null && this.tileSummary.tiles[position].type != 'ROCK') {

                    if (this.tileSummary.tiles[position].type === 'START') {
                        start = i;
                    }

                    if (this.tileSummary.tiles[position].type === 'END') {
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
    private getPosition = (currentPosition: number, direction: Direction ) => {
        switch (direction) {
            case '⭠': {
                return currentPosition % this.tileSummary.rowSize > 0
                    ? currentPosition - 1
                    : null;
            }
            case '⭢': {
                return currentPosition < this.tileSummary.tiles.length -1 && currentPosition % this.tileSummary.rowSize < this.tileSummary.rowSize - 1
                    ? currentPosition + 1
                    : null;
            }
            case '⭡': {
                return currentPosition - this.tileSummary.rowSize < 0 ? null : currentPosition - this.tileSummary.rowSize;
            }
            case '⭣': {
                return currentPosition + this.tileSummary.rowSize > this.tileSummary.tiles.length -1 ? null : currentPosition + this.tileSummary.rowSize;
            }
        }
    }

}