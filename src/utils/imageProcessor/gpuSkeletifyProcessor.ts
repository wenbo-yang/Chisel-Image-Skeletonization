import { Config } from '../../config';
import { Point, SkeletifyProcessor } from '../../types/skeletifyTypes';
import { BitMapBuffer } from '../bitMapBuffer';
import { GPU } from 'gpu.js';
import { convertDataToZeroOneMat, logMat } from './matUtilities';
import { zsThinning } from './zsThinning';
import { constants } from 'buffer';

// NOTE: THIS IS NOT FASTER THAN CPU FOR OUR APPLICATIONS
// WILL NOT USE THIS for V1
export class GpuSkeletifyProcessor implements SkeletifyProcessor {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async thinning(bitMapBuffer: BitMapBuffer): Promise<Array<number[]>> {
        const startTime = Date.now();
        let mat = await convertDataToZeroOneMat(bitMapBuffer, this.config.grayScaleWhiteThreshold);
        let removalMat: number[][] = Array<number[]>(mat.length).fill([]).map(() => Array<number>(mat[0].length).fill(1));
        const thinning = (new GPU()).createKernel(function(mat: number[][], removalMat: number[][], neigbors: number[]) {   
            // function zsThinnigGetTargetPointsStep1(mat: number[][], removalMat: number[][], neigbors: number[], row: number, col: number): boolean {
            //     let hasPointsToRemove = false;
            //     for (let i = 0; i < row; i++) {
            //         for (let j = 0; j < col; j++) {
            //             if (isNotOnTheEdge(mat, i, j, row, col) && isThisATargetToRemoveStep1(mat, i, j, getNeighborValues(mat, neigbors, i, j))) {
            //                 removalMat[i][j] = 0;
            //                 hasPointsToRemove = true;
            //             }
            //         }
            //     }

            //     return hasPointsToRemove;
            // }
            
            // function zsThinnigGetTargetPointsStep2(mat: number[][], removalMat: number[][], neigbors: number[], row: number, col: number): boolean {
            //     let hasPointsToRemove = false;
            //     for (let i = 0; i < row; i++) {
            //         for (let j = 0; j < col; j++) {
            //             if (isNotOnTheEdge(mat, i, j, row, col) && isThisATargetToRemoveStep2(mat, i, j, getNeighborValues(mat, neigbors, i, j))) {
            //                 removalMat[i][j] = 0;
            //                 hasPointsToRemove = true;
            //             }
            //         }
            //     }
            //     return hasPointsToRemove;
            // }
            
            // function isThisATargetToRemoveStep2(mat: number[][], r: number, c: number, neighbors: number[]): boolean {
            //     if (mat[r][c] === 1) {
            //         const sumInRange = sumOfNeighborsInRemovalRange(neighbors);
            //         const numTransIsOne = numberOfTransitionsIsInRemovalRange(neighbors);
            //         const atLeastOneNeighborIsBlank = isAtLeastOneNumberBlankStep2(neighbors);
            //         return sumInRange && numTransIsOne && atLeastOneNeighborIsBlank;
            //     }
            
            //     return false;
            // }
            
            // function isThisATargetToRemoveStep1(mat: number[][], r: number, c: number, neighbors: number[]): boolean {
            //     if (mat[r][c] === 1) {
            //         const sumInRange = sumOfNeighborsInRemovalRange(neighbors);
            //         const numTransIsOne = numberOfTransitionsIsInRemovalRange(neighbors);
            //         const atLeastOneNeighborIsBlank = isAtLeastOneNumberBlankStep1(neighbors);
            //         return sumInRange && numTransIsOne && atLeastOneNeighborIsBlank;
            //     }
            
            //     return false;
            // }
            
            // function isNotOnTheEdge(mat: number[][], i: number, j: number, row: number, col: number): boolean {
            //     if (i == 0 || j == 0 || i == row - 1 || j == col - 1) {
            //         return false;
            //     }
            
            //     return true;
            // }
            
            // function getNeighborValues(mat: number[][], neigbors: number[], r: number, c: number): number[] {
            //     neigbors[0] = mat[r - 1][c];
            //     neigbors[1] = mat[r - 1][c + 1];
            //     neigbors[2] = mat[r][c + 1];
            //     neigbors[3] = mat[r + 1][c + 1];
            //     neigbors[4] = mat[r + 1][c];
            //     neigbors[5] = mat[r + 1][c - 1];
            //     neigbors[6] = mat[r][c - 1];
            //     neigbors[7] = mat[r - 1][c - 1];
            //     return neigbors;
            // }
            
            // function sumOfNeighborsInRemovalRange(neighbors: number[]): boolean {
            //     let sum = 0;
            //     for (let i = 0; i < 8; i++) {
            //         sum += neighbors[i];
            //     }
            
            //     return sum <= 6 && sum >= 2;
            // }
            
            // function numberOfTransitionsIsInRemovalRange(neighbors: number[]): boolean {
            //     const trans = (neighbors[0] === 0 && neighbors[1] === 1 ? 1 : 0) + (neighbors[1] === 0 && neighbors[2] === 1 ? 1 : 0) + (neighbors[2] === 0 && neighbors[3] === 1 ? 1 : 0) + (neighbors[3] === 0 && neighbors[4] === 1 ? 1 : 0) + (neighbors[4] === 0 && neighbors[5] === 1 ? 1 : 0) + (neighbors[5] === 0 && neighbors[6] === 1 ? 1 : 0) + (neighbors[6] === 0 && neighbors[7] === 1 ? 1 : 0) + (neighbors[7] === 0 && neighbors[0] === 1 ? 1 : 0);
            //     return trans === 1;
            // }
            
            // function isAtLeastOneNumberBlankStep1(neighbors: number[]): boolean {
            //     const neighborBlankCondition1 = neighbors[0] === 0 || neighbors[2] === 0 || neighbors[4] === 0;
            //     const neighborBlankCondition2 = neighbors[2] === 0 || neighbors[4] === 0 || neighbors[6] === 0;
            
            //     return neighborBlankCondition1 && neighborBlankCondition2;
            // }
            
            // function isAtLeastOneNumberBlankStep2(neighbors: number[]): boolean {
            //     const neighborBlankCondition1 = neighbors[0] === 0 || neighbors[2] === 0 || neighbors[6] === 0;
            //     const neighborBlankCondition2 = neighbors[0] === 0 || neighbors[4] === 0 || neighbors[7] === 0;
            
            //     return neighborBlankCondition1 && neighborBlankCondition2;
            // }
            
            // function removePoints(mat: number[][], removalMat: number[][], row: number, col: number): void {
            //     for (let i = 0; i < row; i++) {
            //         for (let j = 0; j < col; j ++) {
            //             mat[i][j] &= removalMat[i][j]
            //         }
            //     }

            //     for (let i = 0; i < row; i++) {
            //         for (let j = 0; j < col; j ++) {
            //             removalMat[i][j] = 1;
            //         }
            //     }
            // }
            
            // const row = this.constants.row as number;
            // const col = this.constants.col as number;

            // let shouldRunStep1 = true;
            // let hasPointsToRemove = false;

            // do {
            //     if (shouldRunStep1) {
            //         hasPointsToRemove = zsThinnigGetTargetPointsStep1(mat, removalMat, neigbors, row, col);
            //         removePoints(mat, removalMat, row, col);
            //     } else {
            //         hasPointsToRemove = zsThinnigGetTargetPointsStep2(mat, removalMat, neigbors, row, col);
            //         removePoints(mat, removalMat, row, col);
            //     }
        
            //     shouldRunStep1 = !shouldRunStep1;
            // } while (!shouldRunStep1 || hasPointsToRemove);

            return removalMat[this.thread.y][this.thread.x];
        })
        .setOutput([mat[0].length, mat.length]) // column first and then rows
        .setConstants({row: mat.length, col:mat[0].length})
        .setPrecision('single'); 
        
        mat = thinning(mat, removalMat, [0,0,0,0,0,0,0,0]) as number[][];
        logMat(mat);
        // setup kernel
        // const thinning = (new GPU()).createKernel(function(mat: number[][], size: number[]) {
        
        //     return 
        // }).setOutput([2,2]);
      
        // const out  = thinning(a, b);
        const endTime = Date.now();

        console.log("Done: took " + (endTime - startTime) + "ms");
        return mat;
    }
}
