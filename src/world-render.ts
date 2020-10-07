import {SmartTile} from "./tile";
import {Configuration, TileStyle} from "./config";
import {World} from "./world-generator";

export class WorldRender {

    public ctx;
    private world: World;

    /**
     * Constructor
     *
     * @param ctx context where the maze tiles will be drawn
     * @param world the world to be drawn
     */
    constructor(ctx: CanvasRenderingContext2D, world: World) {
        this.ctx = ctx;
        this.world = world;
    }

    /**
     * Renders the tiles that make up the world
     */
    renderWorld() {
        for (let i = 0; i < this.world.tiles.length; i++) {
            // order of squares is filled from top to bottom
            this.drawTile(this.world.tiles[i]);
        }
    }

    /**
     * Renders the provided tile
     *
     * @param mazeTile the tile to render
     */
    drawTile(mazeTile: SmartTile) {
        const y = Math.floor(mazeTile.position / this.world.rows) * Configuration.getConfig().world.tileSize; // tells you what row you are on.
        const x = mazeTile.position % this.world.rows * Configuration.getConfig().world.tileSize; // tells you what column you are on

        switch (mazeTile.type) {
            case 'ROCK':
                this.drawRock(x, y, Configuration.getConfig().world.theme.rock);
                break;
            case "PATH":
                this.drawPath(x, y, Configuration.getConfig().world.theme.path);
                break;
            case 'START':
                this.drawPath(x, y, Configuration.getConfig().world.theme.start);
                break;
            case 'END':
                this.drawPath(x, y, Configuration.getConfig().world.theme.end);
                break;
        }

        if (Configuration.getConfig().algorithm.showTilePosition) {
            this.drawPathId(x, y, '' + mazeTile.position);
        }
    }

    /**
     * Renders the provided tile using the appropriate highlighted style
     *
     * @param mazeTile the tile to render
     * @param pathStyle the style to apply when rendering a 'PATH' tile
     * @param content optional text to render within the tile.
     */
    highlightTile(mazeTile: SmartTile, pathStyle: TileStyle, content?: string) {
        const y = Math.floor(mazeTile.position / this.world.rows) * Configuration.getConfig().world.tileSize; // tells you what row you are on.
        const x = mazeTile.position % this.world.rows * Configuration.getConfig().world.tileSize; // tells you what column you are on

        switch (mazeTile.type) {
            case 'ROCK':
                this.drawRock(x, y, Configuration.getConfig().world.theme.rock);
                break;
            case "PATH":
                this.drawPath(x, y, pathStyle);
                break;
            case 'START':
                this.drawPath(x, y, Configuration.getConfig().world.theme.start);
                break;
            case 'END':
                this.drawPath(x, y, Configuration.getConfig().world.theme.end);
                break;
        }

        if (Configuration.getConfig().algorithm.showVisitedOrderNumbers && !!content) {
            this.drawPathId(x, y, '' + content);
        }
    }


    drawRock(x: number, y: number, rockStyle: TileStyle) {
        // tile borders
        this.ctx.fillStyle = rockStyle.borderFillStyle;
        this.ctx.fillRect(x , y, Configuration.getConfig().world.tileSize, Configuration.getConfig().world.tileSize);

        // actual square....
        this.ctx.fillStyle = rockStyle.pathFillStyle;
        this.ctx.fillRect(x + 1, y  + 1, Configuration.getConfig().world.tileSize - 1, Configuration.getConfig().world.tileSize - 1);
    }

    drawPath(x: number, y: number, tileStyle: TileStyle) {
        // tile borders
        this.ctx.fillStyle = tileStyle.borderFillStyle;
        this.ctx.fillRect(x , y, Configuration.getConfig().world.tileSize, Configuration.getConfig().world.tileSize);

        // actual square....
        this.ctx.beginPath();
        this.ctx.fillStyle = tileStyle.pathFillStyle;
        this.ctx.fillRect(x +1, y +1, Configuration.getConfig().world.tileSize -1, Configuration.getConfig().world.tileSize -1);
        this.ctx.stroke();
    }

    drawPathId(x: number, y: number, id: string) {
        const offset = 10;
        this.ctx.font = `${Configuration.getConfig().world.theme.path.fontSize}px Arial`;
        this.ctx.fillStyle = "black";
        this.ctx.fillText(id, x + (Configuration.getConfig().world.tileSize/2) - offset, y + (Configuration.getConfig().world.tileSize/2) + offset);
    }

    highlightPathSlowly(result: SmartTile[], index: number, callback: Function, highlightColor: TileStyle, content?: string) {

            if (index < result.length) {
                    setTimeout(()=> {
                        this.highlightTile(result[index], highlightColor, ''+index);

                        this.highlightPathSlowly(result, index + 1, callback, highlightColor);

                        if (index == result.length -1 && callback) {
                            callback();
                        }

                        // if this is the last one then resolve it
                    }, Configuration.getConfig().algorithm.highlightPathMs);
            }
    }

    highlightPathQuickly(result: SmartTile[], index: number, callback: Function, highlightColor: TileStyle, content?: string) {

        for (let i = 0; i < result.length; i++) {
            this.highlightTile(result[i], highlightColor, ''+i);
        }

        if (callback) {
            callback();
        }
    }


}