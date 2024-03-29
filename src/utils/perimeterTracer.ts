import { Config } from '../config';
import { Point, STROKETYPE, Strokes } from '../types/skeletonizeTypes';
import { convert2DMatToString, generate2DMatrix, getOffsetsFromPointList } from './imageProcessor/matUtilities';

export class PerimeterTracer {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async trace(binaryMat: Array<number[]>): Promise<Strokes[]> {
        const islandPerimeters = this.findIslands(binaryMat);
        const perimeterStrokes = this.applyIslandPerimetersToMat(islandPerimeters);

        return perimeterStrokes;
    }

    private async applyIslandPerimetersToMat(islandPerimeters: Point[][]): Promise<Strokes[]> {
        let strokes: Strokes[] = [];

        for (let i = 0; i < islandPerimeters.length; i++) {
            const offsets = getOffsetsFromPointList(islandPerimeters[i]);
            const islandPerimeterMat = this.mapIslandPerimeter(offsets, islandPerimeters[i]);
            const islandPerimeterString = convert2DMatToString(islandPerimeterMat);

            strokes.push({ type: STROKETYPE.PERIMETER, offset: { r: offsets[0].r - 1, c: offsets[0].c - 1 }, stroke: islandPerimeterString });
        }

        return strokes;
    }

    private mapIslandPerimeter(offsets: Point[], islandPerimeter: Point[]): number[][] {
        let islandPerimeterMat: Array<Array<number>> = generate2DMatrix(offsets[1].r - offsets[0].r + 3, offsets[1].c - offsets[0].c + 3);

        for (let i = 0; i < islandPerimeter.length; i++) {
            islandPerimeterMat[islandPerimeter[i].r - offsets[0].r + 1][islandPerimeter[i].c - offsets[0].c + 1] = 1;
        }

        return islandPerimeterMat;
    }

    private findIslands(mat: number[][]): Array<Point[]> {
        const visited: number[][] = generate2DMatrix(mat.length, mat[0].length);

        const row = mat.length;
        const col = mat[0].length;

        const islandPerimeters: Array<Point[]> = [];

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (mat[i][j] === 1 && !this.hasVisited(visited, i, j)) {
                    const islandPerimeter: Point[] = [];
                    this.mapIslandLoop(mat, visited, islandPerimeter, i, j);
                    islandPerimeters.push(islandPerimeter);
                }
            }
        }

        return islandPerimeters;
    }

    private mapIslandLoop(mat: number[][], visited: number[][], islandPerimeter: Point[], r: number, c: number) {
        const stack: Point[] = [];
        stack.push({ r, c });

        while (stack.length !== 0) {
            const currentPoint = stack.pop() || { r: 0, c: 0 };
            if (this.hasVisited(visited, currentPoint.r, currentPoint.c) || mat[currentPoint.r][currentPoint.c] === 0) {
                continue;
            }

            visited[currentPoint.r][currentPoint.c] = 1;
            const neighbors = this.getValidNeighbors(mat, visited, currentPoint.r, currentPoint.c);

            // now mat[r][c] === 1 test 8 neighbors to see if at least 1 is 0
            if (this.isCellOnPerimeter(mat, currentPoint.r, currentPoint.c)) {
                islandPerimeter.push(currentPoint);
            }

            stack.push(...neighbors);
        }
    }

    private hasVisited(visited: number[][], r: number, c: number): boolean {
        return visited[r][c] === 1;
    }

    private getValidNeighbors(mat: number[][], visited: number[][], r: number, c: number): Point[] {
        // hasVisited is double tested in loop or recursion code, since we have white edges, isInBound always returns true
        // prettier-ignore
        return [{ r: r - 1, c }, { r: r + 1, c }, { r, c: c - 1 }, { r, c: c + 1 }].slice();
    }

    private isCellOnPerimeter(mat: number[][], r: number, c: number): boolean {
        // given we have white borders, isInBound will always return true;
        return mat[r - 1][c] + mat[r + 1][c] + mat[r][c - 1] + mat[r][c + 1] + mat[r - 1][c - 1] + mat[r - 1][c + 1] + mat[r + 1][c - 1] + mat[r + 1][c + 1] < 8;
    }

    // private mapIslandRecursion(mat: number[][], visited: number[][], islandPerimeter: Point[], r: number, c: number) {
    //     if (this.hasVisited(visited, r, c) || mat[r][c] === 0) {
    //         return;
    //     }

    //     visited[r][c] = 1;
    //     const neighbors = this.getValidNeighbors(mat, visited, r, c);

    //     if (this.isCellOnPerimeter(mat, r, c)) {
    //         islandPerimeter.push({ r, c });
    //     }

    //     for (let i = 0; i < neighbors.length; i++) {
    //         this.mapIslandRecursion(mat, visited, islandPerimeter, neighbors[i].r, neighbors[i].c);
    //     }
    // }

    // private isInBound(mat: number[][], r: number, c: number) {
    //     const row = mat.length;
    //     const col = mat[0].length;

    //     return r < row && c < col && r >= 0 && c >= 0;
    // }
}
