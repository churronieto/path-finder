import {SmartTile} from "./maze";
import {Queue} from "./queue";
import {World} from "./world-generator";

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

    // maze with direction information
    private world: World;

    private logs: MapSolverLogs = {
        // .length is the max stack size,
        // array contains path taken by algorithm
        traversalPath: []
    }

    constructor(world: World) {
        this.world = world;
    }

    /**
     * Returns the path taken to get "from" point A "to" point b
     * @param maze
     * @param from
     * @param to
     */
    findPath = (): PathDetail => {

        const route: SmartTile[] =  [];
        const traversalPath: SmartTile[] =  [];

        // reset logs
        this.resetLogs();

        // verify that the 'to' and 'from' are actual paths in the maze otherwise there would never be a solution
        // if ( this.detailedMaze.start && this.detailedMaze.mazeTiles[from].type === 'PATH' &&
        //     this.detailedMaze.end && this.detailedMaze.mazeTiles[to].type === 'PATH') {
            const queue = new Queue<number>();
            queue.offer(this.world.start);

            console.log('this.world.start', this.world.start);

            this.composePath(queue,
                {[this.world.start]:this.world.start},
                this.world.tiles,
                this.world.end,
                traversalPath,
                route);
        // }

        return {
            route,
            pathsVisited: traversalPath
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
     * @param traversalPath
     * @param result
     */
    private composePath = (traversalQueue: Queue<number>,
                         visited: any,
                         detailedMaze : SmartTile[],
                         to: number,
                         traversalPath: SmartTile[],
                         result: SmartTile[]): number => {

        // we have inspecting everything we could, queue is empty so lets get out
        if (traversalQueue.isEmpty()) {
            return; // in this situation nothing matched so we are done.
        }

        // there is at least one thing in the queue.
        const current = traversalQueue.poll();

        // order in which the graph was traversed;
        traversalPath.push(detailedMaze[current]);

        // record this as a visited node.

        // found a match add it and get go back
        if (current === to) {
            result.push(detailedMaze[current]);
            return current; // return the node that last matched.
        }

        detailedMaze[current].paths.forEach((tile) => {
            // if it has not been visited yet then add it to the queue
            if (visited[tile] == null) {
                traversalQueue.offer(tile);
                visited['' + tile] = tile;
            }
        });


        // we either found it which should be a path, or not witch should not be a path.
        let previousPathToSolution = this.composePath(traversalQueue, visited, detailedMaze, to, traversalPath, result);

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
}