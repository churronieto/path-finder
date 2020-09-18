///
/// Interfaces
///

export interface Tile {
    type: 'PATH' | 'ROCK' | 'START' | 'END';
}

/**
 * Tile that holds its position in the World and
 */
export interface SmartTile extends Tile {
    // ajacent tiles that can be reached by this tile
    paths: number[],

    // The tile's
    position: number,
}



//
// Types
//

