import {Tile, SmartTile} from "./maze";
import {SpaceStyle, Theme} from "./theme";
import {TilesSummary} from "./world-generator";

export class WorldRender {

    public ctx;
    public pathSize = 50; // route dimention
    public worldOverview: TilesSummary; // route dimention
    public delayDrawMs = 10;

    /**
     *
     * @param ctx context where the maze tiles will be drawn
     * @param worldOverview tiles that make up the maze
     */
    constructor(ctx: CanvasRenderingContext2D, worldOverview: TilesSummary) {
        this.ctx = ctx;
        this.worldOverview = worldOverview;
    }

    renderWorld = () => {

        for (let i = 0; i < this.worldOverview.tiles.length; i++) {
            // order of squares is filled from top to bottom
            this.drawTile(this.worldOverview.tiles[i], i);
        }
    }

    drawTile = (mazeTile: Tile, index: number) =>  {
        const size = this.pathSize;
        const y = Math.floor(index / this.worldOverview.rowSize) * size; // tells you what row you are on.
        const x = index % this.worldOverview.rowSize * size; // tells you what column you are on

        switch (mazeTile.type) {
            case 'ROCK':
                this.drawRock(x,y, Theme.rock);
                break;
            case "PATH":
                this.drawPath(x,y, Theme.path);
                this.drawPathId(x,y, '' + index);
                break;
            case 'START':
                this.drawPath(x,y, Theme.start);
                break;
            case 'END':
                this.drawPath(x,y, Theme.end);

                break;
        }
    }

    highlightTile = (mazeTile: Tile, index: number, highlightColor: SpaceStyle) =>  {
        const size = this.pathSize;
        const y = Math.floor(index / this.worldOverview.rowSize) * size; // tells you what row you are on.
        const x = index % this.worldOverview.rowSize * size; // tells you what column you are on

        switch (mazeTile.type) {
            case 'ROCK':
                this.drawRock(x,y, Theme.visited);
                break;
            case "PATH":
                this.drawPath(x,y, highlightColor);
                this.drawPathId(x,y, '' + index);
                break;
            case 'START':
                this.drawPath(x,y, Theme.start);
                break;
            case 'END':
                this.drawPath(x,y, Theme.end);
                break;
        }
    }


    drawRock(x: number, y: number, rockStyle: SpaceStyle) {
        this.ctx.fillStyle = rockStyle.pathFillStyle;
        this.ctx.fillRect(x, y, this.pathSize, this.pathSize);
    }

    drawPath(x: number, y: number, pathStyle: SpaceStyle) {
        this.ctx.beginPath();
        this.ctx.fillStyle = pathStyle.pathFillStyle;
        this.ctx.fillRect(x, y, this.pathSize, this.pathSize);
        this.ctx.stroke();
    }

    drawPathId(x: number, y: number, id: string) {
        const offset = 10;
        this.ctx.font = `${Theme.path.fontSize}px Arial`;
        this.ctx.fillStyle = "black";
        this.ctx.fillText(id, x + (this.pathSize/2) - offset, y + (this.pathSize/2) + offset);
    }

    // highlightPath = (result: number[]) => {
    //     result.forEach((number) => {
    //         const y = Math.floor(number / this.maze.rowSize) * this.pathSize; // tells you what row you are on.
    //         const x = number % this.maze.rowSize * this.pathSize; // tells you what column you are on
    //
    //         this.ctx.fillStyle = theme.solution.pathFillStyle;
    //         this.ctx.fillRect(x, y, this.pathSize, this.pathSize);
    //
    //         this.ctx.font = `${theme.solution.fontSize}px Arial`;
    //         this.ctx.fillStyle = theme.solution.fontFillStyle;
    //         this.ctx.fillText(number + '', x + (this.pathSize/2) - 10, y + (this.pathSize/2) + 10);
    //     })
    // }

    highlightPathSlowly = (result: SmartTile[], index: number, callback: Function, highlightColor: SpaceStyle) => {

            if (index < result.length) {
                    setTimeout(()=> {
                        this.highlightTile(result[index], result[index].position, highlightColor);

                        // const number = result[index].position;
                        // const y = Math.floor(number / this.maze.rowSize) * this.pathSize; // tells you what row you are on.
                        // const x = number % this.maze.rowSize * this.pathSize; // tells you what column you are on
                        //
                        // this.ctx.fillStyle = highlightColor.pathFillStyle;
                        // this.ctx.fillRect(x, y, this.pathSize, this.pathSize);
                        //
                        // this.ctx.font = `${highlightColor.fontSize}px Arial`;
                        // this.ctx.fillStyle = highlightColor.fontFillStyle;
                        // this.ctx.fillText(number + '', x + (this.pathSize/2) - 10, y + (this.pathSize/2) + 10);

                        this.highlightPathSlowly(result, index + 1, callback, highlightColor);

                        if (index == result.length -1 && callback) {
                            callback();
                        }

                        // if this is the last one then resolve it
                    }, this.delayDrawMs);
            }
    }



}