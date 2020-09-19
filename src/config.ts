import {Direction} from "./world-generator";

export interface Config {
    algorithm: {
        discoveryPath: Direction[],
        showTilePosition: boolean,
        highlightPathMs: number,
        animateRoute: boolean,
        showRoute: boolean,
        animateVisited: boolean,
        animatePathFromStartToEnd: boolean, // true to go from start to end, false to go from end to start
        showVisited: boolean,
        showVisitedOrderNumbers: boolean,

    },
    world: {
        tileSize: number,
        rows: number,
        columns: number,
        obstacleRate: number,
        theme: {
            path: TileStyle,
            start: TileStyle,
            end: TileStyle,
            rock: TileStyle,
            route: TileStyle,
            visited: TileStyle,
        }
    }
}

export interface TileStyle {
    pathFillStyle: string,
    fontFillStyle: string,
    fontSize: number
}

export class Configuration {

    private static _config: any = null;

    // return immutable configuration, this should be the only way we access this data
    static getConfig = (): Config => {

        // console.log('Configuration._config == null',Configuration._config == null );

        if (Configuration._config == null) {
            Configuration._config =  {
                algorithm: {
                    ...Configuration.currentConfiguration.algorithm,
                    discoveryPath: [ ...Configuration.currentConfiguration.algorithm.discoveryPath]
                },
                world: {
                    ...Configuration.currentConfiguration.world,
                    theme: {
                        path: {...Configuration.currentConfiguration.world.theme.path},
                        start: {...Configuration.currentConfiguration.world.theme.start},
                        end: {...Configuration.currentConfiguration.world.theme.end},
                        rock: {...Configuration.currentConfiguration.world.theme.rock},
                        route: {...Configuration.currentConfiguration.world.theme.route},
                        visited: {...Configuration.currentConfiguration.world.theme.visited},
                    }
                }
            }
        }


        return Configuration._config;
    };

    // configuration current state
    private static currentConfiguration: Config = {
        algorithm: {
            discoveryPath: ['⭠', '⭡', '⭢', '⭣'],

            showTilePosition: false, // for debugging, keep at false

            highlightPathMs: 2,

            animatePathFromStartToEnd: true,
            animateRoute: false,
            showRoute: true,

            animateVisited: false,
            showVisited: false,
            showVisitedOrderNumbers: false,

        },
        world: {
            tileSize: 30,
            rows: 100, // placeholder: this value is reset on app initialization to fix browser screen
            columns: 100, // placeholder: this value is reset on app initialization to fix browser screen
            obstacleRate: .3,
            theme: {
                path: {
                    pathFillStyle: '#608190',
                    fontFillStyle: '#2d3436',
                    fontSize: 20
                },
                start: {
                    pathFillStyle: '#f80000',
                    fontFillStyle: '#2d3436',
                    fontSize: 20
                },
                end: {
                    pathFillStyle: '#f8f848',
                    fontFillStyle: '#f8f848',
                    fontSize: 20
                },
                // obstacle
                rock: {
                    pathFillStyle: '#2a3f54',
                    fontFillStyle: 'white',
                    fontSize: 20
                },

                // route to solution
                route: {
                    pathFillStyle: '#f8e8b0',
                    fontFillStyle: '#2d3436',
                    fontSize: 20
                },

                // highlight visited path
                visited: {
                    pathFillStyle: '#3688f8',
                    fontFillStyle: '#2c2c54',
                    fontSize: 20
                },
            }
        }
    };

    ///
    /// configuration allowed
    ///

    /**
     * Set the dimensions of the world
     *
     * @param columns
     * @param rows the height of the world
     */
    static setDimensions = (columns: number, rows?: number) => {
        Configuration.currentConfiguration.world.columns = columns;
        Configuration.currentConfiguration.world.rows = !rows ? columns : rows;
        Configuration._config = null; // to trigger a change
    }

    static setSkipVisited = () => {
        // in case animatePath is not a boolean, we make sure it stays a boolean;
        Configuration.currentConfiguration.algorithm.animatePathFromStartToEnd = true;
        Configuration.currentConfiguration.algorithm.animateRoute = true;
        Configuration.currentConfiguration.algorithm.showRoute = true;
        Configuration.currentConfiguration.algorithm.showVisited = false;
        Configuration._config = null; // to trigger a change
    }

    static setAnimate = () => {
        // It feels more natural to walk back the route when we see the we found the solution
        Configuration.currentConfiguration.algorithm.animatePathFromStartToEnd = false;
        Configuration.currentConfiguration.algorithm.animateRoute = true;
        Configuration.currentConfiguration.algorithm.showRoute = true;
        Configuration.currentConfiguration.algorithm.animateVisited = true;
        Configuration.currentConfiguration.algorithm.showVisited = true;
        Configuration._config = null; // to trigger a change
    }

    static skipVisitedAnimation = () => {
        // in case animatePath is not a boolean, we make sure it stays a boolean;
        Configuration.currentConfiguration.algorithm.animatePathFromStartToEnd = true;
        Configuration.currentConfiguration.algorithm.animateRoute = true;
        Configuration.currentConfiguration.algorithm.showRoute = true;
        Configuration.currentConfiguration.algorithm.animateVisited = false;
        Configuration.currentConfiguration.algorithm.showVisited = true;
        Configuration._config = null; // to trigger a change
    }

    static setSkipAnimations = () => {
        // in case animatePath is not a boolean, we make sure it stays a boolean;
        Configuration.currentConfiguration.algorithm.animateRoute = false;
        Configuration.currentConfiguration.algorithm.showRoute = true;
        Configuration.currentConfiguration.algorithm.animateVisited = false;
        Configuration.currentConfiguration.algorithm.showVisited = true;
        Configuration._config = null; // to trigger a change
    }

}