import {WorldRender} from "./world-render";
import {PathFinder} from "./path-finder";
import {WorldGenerator} from "./world-generator";
import {Theme} from "./theme";

class App {

    public worldRender;
    public pathFinder;
    public tiles;

    constructor() {
        const canvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        // generates random tiles that make up the "world"
        this.tiles = new WorldGenerator().generateTiles(25, 25, .4);

        this.worldRender = new WorldRender(ctx, this.tiles);
        this.pathFinder = new PathFinder(this.tiles);
    }

    initialize() {
        this.worldRender.renderWorld();
    }

    solve() {

        const pathDetail = this.pathFinder.findPath();

        this.worldRender.highlightPathSlowly(pathDetail.pathsVisited, 0,
            () => {
            this.worldRender.highlightPathSlowly(pathDetail.route, 0, null, Theme.solution)
            },
            Theme.visited);
    }

}


///
/// Run the application
///
const app = new App();
app.initialize();
app.solve();
