
export interface MazeTile {
    type: 'PATH' | 'ROCK'
}

export interface MazeTileDetail extends MazeTile {
    paths: number[],
    position: number
}

export type Direction = '⭠' | '⭢' | '⭡' | '⭣';