import {WorldRender} from "./world-render";
import {PathFinder} from "./path-finder";
import {World, WorldGenerator} from "./world-generator";
import {Configuration} from "./config";

const PARAM_MODE = 'mode';
const PARAM_ROWS = 'rows';
const PARAM_COLUMNS = 'columns';


class App {

    public worldRender;
    public pathFinder;
    public world: World;

    constructor() {
        const canvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        // adjust configuration from serach params
        const params = new URLSearchParams(window.location.search);

        if (params.has(PARAM_MODE)) {
            Configuration.setMode(params.get(PARAM_MODE));
        }

        if (params.has(PARAM_COLUMNS)) {
            Configuration.setDimentions(+params.get(PARAM_COLUMNS), +params.get(PARAM_ROWS));
        }

        // generates random tiles that make up the "world"
        this.world = new WorldGenerator().generateWorld(Configuration.getConfig().world.columns, Configuration.getConfig().world.rows, Configuration.getConfig().world.obstacleRate);

        this.worldRender = new WorldRender(ctx, this.world);
        this.pathFinder = new PathFinder(this.world);
    }

    initialize() {
        this.worldRender.renderWorld();
    }

    solve() {
        const pathDetail = this.pathFinder.findPath();


        // default noop function
        let visitedFunction; // not defined
        let routeFunction = () => {};

        // based on configuration animation will be applied
        if (Configuration.getConfig().algorithm.showRoute) {
            routeFunction = Configuration.getConfig().algorithm.animateRoute
                 ? () => {this.worldRender.highlightPathSlowly(pathDetail.route, 0, null, Configuration.getConfig().world.theme.route)}
                 : () => {this.worldRender.highlightPathQuickly(pathDetail.route, 0, null, Configuration.getConfig().world.theme.route)}
        }

        if (Configuration.getConfig().algorithm.showVisited) {
            visitedFunction = Configuration.getConfig().algorithm.animateVisited
                ? () => { this.worldRender.highlightPathSlowly(pathDetail.pathsVisited, 0, routeFunction, Configuration.getConfig().world.theme.visited)}
                : () => { this.worldRender.highlightPathQuickly(pathDetail.pathsVisited, 0, routeFunction, Configuration.getConfig().world.theme.visited)}
        }

        if (visitedFunction) {
            visitedFunction();
        } else {
            routeFunction();
        }

    }

}

///
/// Run the application
///

const app = new App();
app.initialize();
app.solve();
