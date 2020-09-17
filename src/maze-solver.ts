import {Direction, MazeTile, MazeTileDetail} from "./maze";
import {Queue} from "./queue";

/** What Original Maze looks like */
export interface Maze {
    tiles: MazeTile[];
    rowSize: number;
}

interface MapSolverLogs {
    traversalPath: number[]
}

interface PathDetail {
    // a path that between "from" and "to"
    route: number[],

    // all visited paths in the order in which they were visited
    pathsVisited: number[]
}


export class MapSolver {
    // original maze, no directional information
    private maze;

    // maze with direction information
    private detailedMaze: MazeTileDetail[];


    private logs: MapSolverLogs = {
        // .length is the max stack size,
        // array contains path taken by algorithm
        traversalPath: []
    }

    constructor(maze: Maze) {
        this.maze = maze;

        // create once and reuse
        this.detailedMaze = this.createGraphFromMaze();
    }




    /**
     * Returns the path taken to get "from" point A "to" point b
     * @param maze
     * @param from
     * @param to
     */
    findPath = (from: number, to: number): PathDetail => {

        const route: number[] =  [];

        // reset logs
        this.resetLogs();

        // verify that the 'to' and 'from' are actual paths in the maze otherwise there would never be a solution
        if ( this.detailedMaze[from] && this.detailedMaze[from].type === 'PATH' &&
            this.detailedMaze[to] && this.detailedMaze[to].type === 'PATH') {
            const queue = new Queue<number>();
            queue.offer(from);

            this.composePath(queue,
                {},
                this.detailedMaze,
                to,
                route);
        }

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
                         detailedMaze : MazeTileDetail[],
                         to: number,
                         result: number[]): number => {

        // console.log('traversalQueue                     ', traversalQueue.toArray());
        // console.log('visited                     ', {...visited});

        // we have inspecting everything we could, queue is empty so lets get out
        if (traversalQueue.isEmpty()) {
            return; // in this situation nothing matched so we are done.
        }

        // there is at least one thing in the queue.
        const current = traversalQueue.poll();

        // order in which the graph was traversed;
        this.logs.traversalPath.push(current);

        // record this as a visited node.

        // found a match add it and get go back
        if (current === to) {
            result.push(current);
            console.log("found match!!!");
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
                result.push(current);
                return current;
            }
        }

        return previousPathToSolution;
    }

    private createGraphFromMaze = () : MazeTileDetail[] => {
        const mazeGraph: MazeTileDetail[] = [];

        for (let i = 0; i < this.maze.tiles.length; i++) {

            const details: MazeTileDetail = {
                paths: [],
                position: i,
                type: this.maze.tiles[i].type
            };

            mazeGraph.push(details);

            if (details.type != 'PATH') {
                continue; // continue if this is not a path since it should not have any connections
            }

            ['⭠', '⭢', '⭡', '⭣'].forEach((direction: Direction) => {
                let position = this.getPosition(i, direction);
                if (position != null && this.maze.tiles[position].type === 'PATH') {
                    details.paths.push(position);
                }
            });

        }

        return mazeGraph;
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
                return currentPosition % this.maze.rowSize > 0
                    ? currentPosition - 1
                    : null;
            }
            case '⭢': {
                return currentPosition < this.maze.tiles.length -1 && currentPosition % this.maze.rowSize < this.maze.rowSize - 1
                    ? currentPosition + 1
                    : null;
            }
            case '⭡': {
                return currentPosition - this.maze.rowSize < 0 ? null : currentPosition - this.maze.rowSize;
            }
            case '⭣': {
                return currentPosition + this.maze.rowSize > this.maze.tiles.length -1 ? null : currentPosition + this.maze.rowSize;
            }
        }
    }

}