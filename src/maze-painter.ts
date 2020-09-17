import {MazeTile} from "./maze";
import {Maze} from "./maze-solver";
import {SpaceStyle} from "./theme";

export class MazePainter {

    public ctx;
    public pathSize = 50; // route dimention
    public maze: Maze; // route dimention
    public delayDrawMs = 10;

    public theme  = {
        solution: {
            pathFillStyle: '#706fd3',
            fontFillStyle: '#2c2c54',
            fontSize: '10'
        },
        path: {
            pathFillStyle: '#f7f1e3',
            fontFillStyle: '#2d3436',
            fontSize: '10'
        },
        rock: {
            pathFillStyle: '#84817a',
            fontFillStyle: '#2d3436'
        }
    }

    /**
     *
     * @param ctx context where the maze tiles will be drawn
     * @param maze tiles that make up the maze
     */
    constructor(ctx: CanvasRenderingContext2D, maze: Maze) {
        this.ctx = ctx;
        this.maze = maze;
    }

    drawMaze = () => {

        for (let i = 0; i < this.maze.tiles.length; i++) {
            // order of squares is filled from top to bottom
            this.drawTile(this.maze.tiles[i], i, this.maze.rowSize);
        }
    }

    drawTile = (mazeTile: MazeTile, index: number, rowLength: number) =>  {
        const size = this.pathSize;
        const y = Math.floor(index / rowLength) * size; // tells you what row you are on.
        const x = index % rowLength * size; // tells you what column you are on

        if (mazeTile.type === 'ROCK') {
            this.drawRock(x,y);
        } else {
            this.drawPath(x, y);
            this.drawPathId(x,y, '' + index);
        }
    }

    drawRock(x: number, y: number) {
        this.ctx.fillStyle = this.theme.rock.pathFillStyle;
        this.ctx.fillRect(x, y, this.pathSize, this.pathSize);
    }

    drawPath(x: number, y: number) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.theme.path.pathFillStyle;
        this.ctx.fillRect(x, y, this.pathSize, this.pathSize);
        this.ctx.stroke();
    }

    drawPathId(x: number, y: number, id: string) {
        const offset = 10;
        this.ctx.font = `${this.theme.path.fontSize}px Arial`;
        this.ctx.fillStyle = "black";
        this.ctx.fillText(id, x + (this.pathSize/2) - offset, y + (this.pathSize/2) + offset);
    }

    highlightPath = (result: number[]) => {
        result.forEach((number) => {
            const y = Math.floor(number / this.maze.rowSize) * this.pathSize; // tells you what row you are on.
            const x = number % this.maze.rowSize * this.pathSize; // tells you what column you are on

            this.ctx.fillStyle = this.theme.solution.pathFillStyle;
            this.ctx.fillRect(x, y, this.pathSize, this.pathSize);

            this.ctx.font = `${this.theme.solution.fontSize}px Arial`;
            this.ctx.fillStyle = this.theme.solution.fontFillStyle;
            this.ctx.fillText(number + '', x + (this.pathSize/2) - 10, y + (this.pathSize/2) + 10);
        })
    }

    highlightPathSlowly = (result: number[], index: number, callback: Function, highlightColor: SpaceStyle) => {

            if (index < result.length) {
                    setTimeout(()=> {
                        const number = result[index];
                        const y = Math.floor(number / this.maze.rowSize) * this.pathSize; // tells you what row you are on.
                        const x = number % this.maze.rowSize * this.pathSize; // tells you what column you are on

                        this.ctx.fillStyle = highlightColor.pathFillStyle;
                        this.ctx.fillRect(x, y, this.pathSize, this.pathSize);

                        this.ctx.font = `${highlightColor.fontSize}px Arial`;
                        this.ctx.fillStyle = highlightColor.fontFillStyle;
                        this.ctx.fillText(number + '', x + (this.pathSize/2) - 10, y + (this.pathSize/2) + 10);

                        // if (index == result.length -1) {
                        //     return;
                        // }

                        this.highlightPathSlowly(result, index + 1, callback, highlightColor);

                        if (index == result.length -1 && callback) {
                            callback();
                        }

                        // if this is the last one then resolve it
                    }, this.delayDrawMs);
            }
    }



}