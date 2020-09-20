# Path Finder 
Small demo of path finding that does the following:
1. Randomly create tiles on initial load to fill up the screen. (Refresh to generate new set of tiles)
2. Uses BFS to locate a path connecting the "START" and "END" tiles 
3. Draws the world and animates the solution.

## Demo

https://churronieto.github.io/path-finder/

### Alternatives

https://churronieto.github.io/path-finder/?mode=skipVisited

https://churronieto.github.io/path-finder/?mode=skipAnimations

https://churronieto.github.io/path-finder/?mode=skipVisitedAnimation

### Tile Descriptions

#### Rocks - dark gray tiles 
* Multiple 
* Represent obstacles that cannot be traveled on. 
* A solution won't use these tiles.

#### Paths - light gray tiles
* Multiple 
* Represent paths that can be traveled on. 
* A solution will use these tiles.
* If a solution visits this path, tile will become light blue
* If a solution uses this path to form a route tile will become light peach.

#### Start - red tile
* Just one 
* Represent the start of a possible route.
* A solution will start on this tile.

#### End - yellow tile
* Just one 
* Represent the end of a possible route.
* A solution will end on this tile.