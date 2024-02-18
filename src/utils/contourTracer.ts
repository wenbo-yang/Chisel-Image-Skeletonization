import { Config } from '../config';
import { Point, STROKETYPE, Strokes } from '../types/skeletonizeTypes';
import { convert2DMatToString, generate2DMatrix, getOffsetsFromPointList, logMat } from './imageProcessor/matUtilities';

export class ContourTracer {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async trace(binaryMat: Array<number[]>): Promise<Strokes[]> {
        const islandContours = this.findIslands(binaryMat);
        const contourStrokes = this.applyIslandContoursToMat(islandContours);

        return contourStrokes;
    }

    private async applyIslandContoursToMat(islandContours: Point[][]): Promise<Strokes[]> {
        let strokes: Strokes[] = [];

        for (let i = 0; i < islandContours.length; i++) {
            const offsets = getOffsetsFromPointList(islandContours[i]);
            const islandContourMat = this.mapIslandContour(offsets, islandContours[i]);
            const islandContourString = convert2DMatToString(islandContourMat);

            strokes.push({ type: STROKETYPE.CONTOUR, offset: { r: offsets[0].r - 1, c: offsets[0].c - 1 }, stroke: islandContourString });
        }

        return strokes;
    }

    private mapIslandContour(offsets: Point[], islandContour: Point[]): number[][] {
        let islandContourMat: Array<Array<number>> = generate2DMatrix(offsets[1].r - offsets[0].r + 3, offsets[1].c - offsets[0].c + 3);

        for (let i = 0; i < islandContour.length; i++) {
            islandContourMat[islandContour[i].r - offsets[0].r + 1][islandContour[i].c - offsets[0].c + 1] = 1;
        }

        return islandContourMat;
    }

    private findIslands(mat: number[][]): Array<Point[]> {
        const visited: number[][] = generate2DMatrix(mat.length, mat[0].length);

        const row = mat.length;
        const col = mat[0].length;

        const islandContours: Array<Point[]> = [];

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (mat[i][j] === 1 && !this.hasVisited(visited, i, j)) {
                    const islandContour: Point[] = [];
                    this.mapIslandLoop(mat, visited, islandContour, i, j);
                    islandContours.push(islandContour);
                }
            }
        }

        return islandContours;
    }

    private mapIslandRecursion(mat: number[][], visited: number[][], islandContour: Point[], r: number, c: number) {
        if (this.hasVisited(visited, r, c) || mat[r][c] === 0) {
            return;
        }

        visited[r][c] = 1;
        const neighbors = this.getValidNeighbors(mat, visited, r, c);

        if (this.isCellOnContour(mat, r, c)) {
            islandContour.push({ r, c });
        }

        for (let i = 0; i < neighbors.length; i++) {
            this.mapIslandRecursion(mat, visited, islandContour, neighbors[i].r, neighbors[i].c);
        }
    }

    private mapIslandLoop(mat: number[][], visited: number[][], islandContour: Point[], r: number, c: number) {
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
            if (this.isCellOnContour(mat, currentPoint.r, currentPoint.c)) {
                islandContour.push(currentPoint);
            }

            stack.push(...neighbors);
        }
    }

    private getValidNeighbors(mat: number[][], visited: number[][], r: number, c: number): Point[] {
        // hasVisited is double tested in loop or recursion code, since we have white edges, isInBound always returns true
        // prettier-ignore
        return [{ r: r - 1, c }, { r: r + 1, c }, { r, c: c - 1 }, { r, c: c + 1 }].slice();

        // const neighbors: Point[] = [];

        // if (this.isInBound(mat, r - 1, c) && !this.hasVisited(visited, r - 1, c)) {
        //     neighbors.push({ r: r - 1, c }); // up
        // }
        // if (this.isInBound(mat, r + 1, c) && !this.hasVisited(visited, r + 1, c)) {
        //     neighbors.push({ r: r + 1, c }); // down
        // }
        // if (this.isInBound(mat, r, c - 1) && !this.hasVisited(visited, r, c - 1)) {
        //     neighbors.push({ r, c: c - 1 }); // left
        // }
        // if (this.isInBound(mat, r, c + 1) && !this.hasVisited(visited, r, c + 1)) {
        //     neighbors.push({ r, c: c + 1 }); // right
        // }

        // return neighbors;
    }

    private isCellOnContour(mat: number[][], r: number, c: number): boolean {
        // given we have white borders, isInBound will always return true;
        return mat[r - 1][c] + mat[r + 1][c] + mat[r][c - 1] + mat[r][c + 1] + mat[r - 1][c - 1] + mat[r - 1][c + 1] + mat[r + 1][c - 1] + mat[r + 1][c + 1] < 8;

        // if (this.isInBound(mat, r - 1, c) && mat[r - 1][c] === 0) {
        //     return true; // up
        // }

        // if (this.isInBound(mat, r + 1, c) && mat[r + 1][c] === 0) {
        //     return true; // down
        // }

        // if (this.isInBound(mat, r, c - 1) && mat[r][c - 1] === 0) {
        //     return true; // left
        // }

        // if (this.isInBound(mat, r, c + 1) && mat[r][c + 1] === 0) {
        //     return true; // right
        // }

        // if (this.isInBound(mat, r - 1, c - 1) && mat[r - 1][c - 1] === 0) {
        //     return true; // top left
        // }

        // if (this.isInBound(mat, r - 1, c + 1) && mat[r - 1][c + 1] === 0) {
        //     return true; // top right
        // }

        // if (this.isInBound(mat, r + 1, c - 1) && mat[r + 1][c - 1] === 0) {
        //     return true; // bottom left
        // }

        // if (this.isInBound(mat, r + 1, c + 1) && mat[r + 1][c + 1] === 0) {
        //     return true; // bottom right
        // }

        // return false;
    }

    private hasVisited(visited: number[][], r: number, c: number): boolean {
        return visited[r][c] === 1;
    }

    private isInBound(mat: number[][], r: number, c: number) {
        const row = mat.length;
        const col = mat[0].length;

        return r < row && c < col && r >= 0 && c >= 0;
    }
}
