export interface SpaceStyle {
    pathFillStyle: string,
    fontFillStyle: string,
    fontSize: string
}

export const Theme = {
    // walkable path
    path: {
        pathFillStyle: '#608190', //'#f7f1e3',
        fontFillStyle: '#2d3436',
        fontSize: '20'
    },
    start: {
        pathFillStyle: '#f80000', //'#f7f1e3',
        fontFillStyle: '#2d3436',
        fontSize: '20'
    },
    end: {
        pathFillStyle: '#f8f848', //'#f7f1e3',
        fontFillStyle: '#f8f848',
        fontSize: '20'
    },
    // obstacle
    rock: {
        pathFillStyle: '#2a3f54', // '#84817a',
        fontFillStyle: 'white',
        fontSize: '20'
    },

    // route to solution
    solution: {
        pathFillStyle: '#f8e8b0',
        fontFillStyle: '#2d3436',
        fontSize: '20'
    },

    // highlight visited path
    visited: {
        pathFillStyle: '#3688f8',
        fontFillStyle: '#2c2c54',
        fontSize: '20'
    },

}
