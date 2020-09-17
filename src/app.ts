import {MazePainter} from "./maze-painter";
import {MapSolver} from "./maze-solver";
import {MazeCreator} from "./maze-creator";
import {theme} from "./theme";

class App {

    public mazePainter;
    public mazeSolver;

    constructor() {
        const canvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        const maze = new MazeCreator().createMaze(25, 25, .4);

        this.mazePainter = new MazePainter(ctx, maze);
        this.mazeSolver = new MapSolver(maze);
    }

    initialize() {
        this.mazePainter.drawMaze();
    }

    solve(from: number, to: number ) {
        const pathDetail = this.mazeSolver.findPath(from, to);
        // this.mazePainter.highlightPath(pathDetail.route);
        // this.mazePainter.highlightPathSlowly(pathDetail.route, 0);
        this.mazePainter.highlightPathSlowly(pathDetail.pathsVisited, 0,
            () => {this.mazePainter.highlightPathSlowly(pathDetail.route, 0, null, theme.solution)},
            theme.visited);
    }
}

const app = new App();
app.initialize();
app.solve(9, 1470);
