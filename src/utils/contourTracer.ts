import { Config } from '../config';
import { Point } from '../types/skeletonizeTypes';

export class ContourTracer {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public trace(binaryMat: Array<number[]>): Array<Array<number[]>> {
        let retVal: Array<Array<number[]>> = [];

        this.findIslands(binaryMat);

        return [];
    }


    private findIslands(mat: number[][]): Array<Point[]> {
        const visited: number[][] = Array<number[]>(mat.length)
        .fill([])
        .map(() => Array<number>(mat[0].length).fill(0));

        const row = mat.length;
        const col = mat[0].length;

        const islands: Array<Point[]> = [];

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (mat[i][j] === 1 && !this.hasVisited(visited, i, j)) {
                    const island: Point[] = []; 
                    this.mapIsland(mat, visited, island, i, j);
                    islands.push(island)
                }
            }
        }

        return islands;
    }

    private mapIsland(mat: number[][], visited: number[][], island: Point[], r: number, c: number) {
        if (this.hasVisited(visited, r, c) || mat[r][c] === 0) {
            return;
        }

        visited[r][c] = 1;
        const neighbors = this.getValidNeighbors(mat, visited, r, c);
        // now mat[r][c] === 1
        island.push({r,c});

        for (let i = 0; i < neighbors.length; i++) {
            this.mapIsland(mat, visited, island, neighbors[i].r, neighbors[i].c);
        }

        return;
    }
    
    private getValidNeighbors(mat: number[][], visited: number[][], r: number, c: number) {
        const neighbors: Point[] = [];

        if (this.isInBound(mat, r - 1, c) && !this.hasVisited(visited, r - 1, c)) {
            neighbors.push({r: r - 1,c}); // up 
        }
        if (this.isInBound(mat, r + 1, c) && !this.hasVisited(visited, r + 1, c)) {
            neighbors.push({r: r+1,c}); // down
        }
        if (this.isInBound(mat, r, c - 1) && !this.hasVisited(visited, r, c - 1)) {
            neighbors.push({r, c:c - 1}); // left
        }
        if (this.isInBound(mat, r, c+1) && !this.hasVisited(visited, r, c+1)) {
            neighbors.push({r,c: c+1}); // right
        }

        return neighbors;

    }

    private hasVisited(visited: number[][], r: number, c: number): boolean {
        return visited[r][c] === 1;
    }

    private isInBound(mat:number[][], r: number, c: number) {
        const row = mat.length;
        const col = mat[0].length;

        return r < row && c < col && r >=0 && c >= 0;
    }
}
