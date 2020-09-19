///
/// Interfaces
///


/**
 * SmartTiles are tiles that are aware of their surroundings
 */
export interface SmartTile extends Tile {
    // ajacent tiles that can be reached by this tile
    paths: number[],

    // The tile's
    position: number,
}

/**
 * Tiles are what make up the world
 */
export interface Tile {
    type: 'PATH' | 'ROCK' | 'START' | 'END';
}
