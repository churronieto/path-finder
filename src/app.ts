import {WorldRender} from "./world-render";
import {PathFinder} from "./path-finder";
import {World, WorldGenerator} from "./world-generator";
import {Configuration} from "./config";

const PARAM_MODE = 'mode';
const PARAM_ROWS = 'rows';
const PARAM_COLUMNS = 'columns';


class App {

    public worldRender: WorldRender;
    public pathFinder: PathFinder;
    public world: World;

    constructor() {}

    initialize() {
        const canvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
        canvas.height = window.innerHeight -4;
        canvas.width = window.innerWidth -4;

        const ctx = canvas.getContext("2d");

        // adjust configuration from search params
        this.setConfiguration();

        // generates random tiles that make up the "world"
        this.world = new WorldGenerator().generateWorld(
            Configuration.getConfig().world.columns,
            Configuration.getConfig().world.rows,
            Configuration.getConfig().world.obstacleRate);

        this.worldRender = new WorldRender(ctx, this.world);
        this.pathFinder = new PathFinder(this.world);

        this.worldRender.renderWorld();
    }

    private setConfiguration() {
        const params = new URLSearchParams(window.location.search);
        this.setMode(params.get(PARAM_MODE));

        const rows = params.has(PARAM_ROWS)
            ?+params.get(PARAM_ROWS)
            : Math.floor(window.innerWidth / Configuration.getConfig().world.tileSize);

        const columns = params.has(PARAM_COLUMNS)
            ?+params.get(PARAM_COLUMNS)
            : Math.floor(window.innerHeight / Configuration.getConfig().world.tileSize);

        Configuration.setDimensions(columns, rows);
    }


    private setMode(mode: string) {
        switch (mode) {
            case 'skipVisited': {
                Configuration.setSkipVisited();
                break;
            }
            case 'animate': {
                Configuration.setAnimate();
                break;
            }
            case 'skipAnimations': {
                Configuration.setSkipAnimations();
                break;
            }
            case 'skipVisitedAnimation': {
                Configuration.skipVisitedAnimation();
                break;
            }
            default: {
                Configuration.setAnimate();
                break;
            }
        }
    }

    /**
     * Finds a path form the start to end points
     */
    solve() {
        // find the solution if one exists.
        const pathDetail = this.pathFinder.findPath();

        // default noop function
        let visitedFunction; // not defined
        let routeFunction = () => {};

        // based on configuration animation will be applied
        if (Configuration.getConfig().algorithm.showRoute) {


            const orderedPath = Configuration.getConfig().algorithm.animatePathFromStartToEnd
                ? pathDetail.route.reverse()
                : pathDetail.route;

            routeFunction = Configuration.getConfig().algorithm.animateRoute
                 ? () => {this.worldRender.highlightPathSlowly(orderedPath, 0, null, Configuration.getConfig().world.theme.route)}
                 : () => {this.worldRender.highlightPathQuickly(orderedPath, 0, null, Configuration.getConfig().world.theme.route)}
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
