export interface SpaceStyle {
    pathFillStyle: string,
    fontFillStyle: string,
    fontSize: string
}

export const theme = {
    // walkable path
    path: {
        pathFillStyle: '#f7f1e3',
        fontFillStyle: '#2d3436',
        fontSize: '20'
    },

    // obstacle
    rock: {
        pathFillStyle: '#84817a',
        fontFillStyle: '#2d3436'
    },

    // route to solution
    solution: {
        pathFillStyle: '#00b894',
        fontFillStyle: 'white',
        fontSize: '20'
    },

    // highlight visited path
    visited: {
        pathFillStyle: '#706fd3',
        fontFillStyle: '#2c2c54',
        fontSize: '20'
    },

}
