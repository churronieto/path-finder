import {Tile, SmartTile} from "./maze";
import {Configuration, TileStyle} from "./config";
import {World} from "./world-generator";

export class WorldRender {

    public ctx;
    private world: World;

    /**
     *
     * @param ctx context where the maze tiles will be drawn
     * @param world
     */
    constructor(ctx: CanvasRenderingContext2D, world: World) {
        this.ctx = ctx;
        this.world = world;
    }

    renderWorld = () => {

        for (let i = 0; i < this.world.tiles.length; i++) {
            // order of squares is filled from top to bottom
            this.drawTile(this.world.tiles[i], i);
        }
    }

    drawTile = (mazeTile: Tile, index: number) =>  {
        const y = Math.floor(index / this.world.rows) * Configuration.getConfig().world.tileSize; // tells you what row you are on.
        const x = index % this.world.rows * Configuration.getConfig().world.tileSize; // tells you what column you are on

        switch (mazeTile.type) {
            case 'ROCK':
                this.drawRock(x,y, Configuration.getConfig().world.theme.rock);
                break;
            case "PATH":
                this.drawPath(x,y, Configuration.getConfig().world.theme.path);
                break;
            case 'START':
                this.drawPath(x,y, Configuration.getConfig().world.theme.start);
                break;
            case 'END':
                this.drawPath(x,y, Configuration.getConfig().world.theme.end);
                break;
        }

        if (Configuration.getConfig().algorithm.showTilePosition) {
            this.drawPathId(x,y, '' + index);
        }


    }

    /**
     *
     * @param mazeTile
     * @param index
     * @param highlightColor
     * @param content text to display within the tile
     */
    highlightTile = (mazeTile: Tile, index: number, highlightColor: TileStyle, content?: string) =>  {
        const y = Math.floor(index / this.world.rows) * Configuration.getConfig().world.tileSize; // tells you what row you are on.
        const x = index % this.world.rows * Configuration.getConfig().world.tileSize; // tells you what column you are on

        switch (mazeTile.type) {
            case 'ROCK':
                this.drawRock(x,y, Configuration.getConfig().world.theme.visited);
                break;
            case "PATH":
                this.drawPath(x,y, highlightColor);
                break;
            case 'START':
                this.drawPath(x,y, Configuration.getConfig().world.theme.start);
                break;
            case 'END':
                this.drawPath(x,y, Configuration.getConfig().world.theme.end);
                break;
        }

        if (Configuration.getConfig().algorithm.showVisitedOrderNumbers && !!content) {
            this.drawPathId(x ,y, '' + content);
        }
    }


    drawRock(x: number, y: number, rockStyle: TileStyle) {

        // space
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(x , y, Configuration.getConfig().world.tileSize, Configuration.getConfig().world.tileSize);


        // actual square....
        this.ctx.fillStyle = rockStyle.pathFillStyle;
        this.ctx.fillRect(x + 1, y  + 1, Configuration.getConfig().world.tileSize - 1, Configuration.getConfig().world.tileSize - 1);
    }

    drawPath(x: number, y: number, pathStyle: TileStyle) {

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(x , y, Configuration.getConfig().world.tileSize, Configuration.getConfig().world.tileSize);

        this.ctx.beginPath();
        this.ctx.fillStyle = pathStyle.pathFillStyle;
        this.ctx.fillRect(x +1, y +1, Configuration.getConfig().world.tileSize -1, Configuration.getConfig().world.tileSize -1);
        this.ctx.stroke();
    }

    drawPathId(x: number, y: number, id: string) {
        const offset = 10;
        this.ctx.font = `${Configuration.getConfig().world.theme.path.fontSize}px Arial`;
        this.ctx.fillStyle = "black";
        this.ctx.fillText(id, x + (Configuration.getConfig().world.tileSize/2) - offset, y + (Configuration.getConfig().world.tileSize/2) + offset);
    }

    highlightPathSlowly = (result: SmartTile[], index: number, callback: Function, highlightColor: TileStyle, content?: string) => {

            if (index < result.length) {
                    setTimeout(()=> {
                        this.highlightTile(result[index], result[index].position, highlightColor, ''+index);

                        this.highlightPathSlowly(result, index + 1, callback, highlightColor);

                        if (index == result.length -1 && callback) {
                            callback();
                        }

                        // if this is the last one then resolve it
                    }, Configuration.getConfig().algorithm.highlightPathMs);
            }
    }

    highlightPathQuickly = (result: SmartTile[], index: number, callback: Function, highlightColor: TileStyle, content?: string) => {

        for (let i = 0; i < result.length; i++) {
            this.highlightTile(result[i], result[i].position, highlightColor, ''+i);
        }

        if (callback) {
            callback();
        }
    }


}