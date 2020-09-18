import {Direction} from "./world-generator";

export interface Config {
    algorithm: {
        discoveryPath: Direction[],
        showTilePosition: boolean,
        highlightPathMs: number,
        animateRoute: boolean,
        showRoute: boolean,
        animateVisited: boolean,
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

            animateRoute: false,
            showRoute: true,

            animateVisited: false,
            showVisited: false,
            showVisitedOrderNumbers: false,

        },
        world: {
            tileSize: 10,
            rows: 100,
            columns: 75,
            obstacleRate: .4,
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


    static setMode = (mode: string) => {
        switch (mode) {
            case 'skipVisited': {
                Configuration.routeOnly();
                break;
            }
            case 'skipVisitedAnimation': {
                Configuration.animateRouteOnly();
                break;
            }
            case 'animate': {
                Configuration.animateSolution();
                break;
            }
            case 'skipAnimations': {
                Configuration.quickSolution();
                break;
            }
        }
    }

    static routeOnly = () => {
        // in case animatePath is not a boolean, we make sure it stays a boolean;
        Configuration.currentConfiguration.algorithm.animateRoute = true;
        Configuration.currentConfiguration.algorithm.showRoute = true;
        Configuration.currentConfiguration.algorithm.showVisited = false;
        Configuration._config = null; // to trigger a change
    }

    static animateSolution = () => {
        // in case animatePath is not a boolean, we make sure it stays a boolean;
        Configuration.currentConfiguration.algorithm.animateRoute = true;
        Configuration.currentConfiguration.algorithm.showRoute = true;
        Configuration.currentConfiguration.algorithm.animateVisited = true;
        Configuration.currentConfiguration.algorithm.showVisited = true;
        Configuration._config = null; // to trigger a change
    }

    static animateRouteOnly = () => {
        // in case animatePath is not a boolean, we make sure it stays a boolean;
        Configuration.currentConfiguration.algorithm.animateRoute = true;
        Configuration.currentConfiguration.algorithm.showRoute = true;
        Configuration.currentConfiguration.algorithm.animateVisited = false;
        Configuration.currentConfiguration.algorithm.showVisited = true;
        Configuration._config = null; // to trigger a change
    }

    static quickSolution = () => {
        // in case animatePath is not a boolean, we make sure it stays a boolean;
        Configuration.currentConfiguration.algorithm.animateRoute = false;
        Configuration.currentConfiguration.algorithm.showRoute = true;
        Configuration.currentConfiguration.algorithm.animateVisited = false;
        Configuration.currentConfiguration.algorithm.showVisited = true;
        Configuration._config = null; // to trigger a change
    }

    static setDimentions = (columns: number, rows?: number) => {

        if (!rows) {
            rows = columns;
        }

        console.log('columns', columns);
        console.log('rows', rows);

        Configuration.currentConfiguration.world.columns = columns;
        Configuration.currentConfiguration.world.rows = rows;
        Configuration._config = null; // to trigger a change

    }

}