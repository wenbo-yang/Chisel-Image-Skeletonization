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
        let neighbors: number[] = [0,0,0,0,0,0,0,0];
        
        // function gpuZsThinnigGetTargetPointsStep1(mat: number[][], removalMat: number[][], neighbors: number[], row: number, col: number): boolean {
        //     let hasPointsToRemove = false;

        
        //     return hasPointsToRemove;
        // }
        
        // function gpuZsThinnigGetTargetPointsStep2(mat: number[][], removalMat: number[][], neighbors: number[], row: number, col: number): boolean {
        //         let hasPointsToRemove = false;
        //         for (let i = 0; i < row; i++) {
        //             for (let j = 0; j < col; j++) {
        //                 if (gpuIsNotOnTheEdge(mat, i, j, row, col)) {
        //                     gpuGetNeighborValues(mat, neighbors, i, j);
        //                     if(gpuIsThisATargetToRemoveStep2(mat, i, j, neighbors)) {
        //                         removalMat[i][j] = 0;
        //                         hasPointsToRemove = true;
        //                     }
        //                 }
        //             }
        //         }
        //         return hasPointsToRemove;
        //     }
            
        // function gpuIsThisATargetToRemoveStep2(mat: number[][], r: number, c: number, neighbors: number[]): boolean {
        //     if (mat[r][c] === 1) {
        //         const sumInRange = gpuSumOfNeighborsInRemovalRange(neighbors);
        //         const numTransIsOne = gpuNumberOfTransitionsIsInRemovalRange(neighbors);
        //         const atLeastOneNeighborIsBlank = gpuIsAtLeastOneNumberBlankStep2(neighbors);
        //         return sumInRange && numTransIsOne && atLeastOneNeighborIsBlank;
        //     }
        
        //     return false;
        // }
        
        // function gpuIsThisATargetToRemoveStep1(mat: number[][], r: number, c: number, neighbors: number[]): boolean {
        //     if (mat[r][c] === 1) {
        //         const sumInRange = gpuSumOfNeighborsInRemovalRange(neighbors);
        //         const numTransIsOne = gpuNumberOfTransitionsIsInRemovalRange(neighbors);
        //         const atLeastOneNeighborIsBlank = gpuIsAtLeastOneNumberBlankStep1(neighbors);
        //         return sumInRange && numTransIsOne && atLeastOneNeighborIsBlank;
        //     }
        
        //     return false;
        // }
        
        // function gpuIsNotOnTheEdge(mat: number[][], i: number, j: number, row: number, col: number): boolean {
        //     if (i == 0 || j == 0 || i == row - 1 || j == col - 1) {
        //         return false;
        //     }
        
        //     return true;
        // }
        
        // function gpuGetNeighborValues(mat: number[][], neighbors: number[], r: number, c: number) {
        //     neighbors[0] = mat[r - 1][c];
        //     neighbors[1] = mat[r - 1][c + 1];
        //     neighbors[2] = mat[r][c + 1];
        //     neighbors[3] = mat[r + 1][c + 1];
        //     neighbors[4] = mat[r + 1][c];
        //     neighbors[5] = mat[r + 1][c - 1];
        //     neighbors[6] = mat[r][c - 1];
        //     neighbors[7] = mat[r - 1][c - 1];
        // }
        
        function gpuSumOfNeighbors(mat: number[][], r: number, c: number): number {
            return mat[r - 1][c] + 
                   mat[r - 1][c + 1] + 
                   mat[r][c + 1] + 
                   mat[r + 1][c + 1] + 
                   mat[r + 1][c] + 
                   mat[r + 1][c - 1] + 
                   mat[r][c - 1] + 
                   mat[r - 1][c - 1];
        }
        
        function gpuNumberOfTransitions(mat: number[][], r: number, c: number): number {
            let trans = 0;

            if (mat[r - 1][c] === 0 && mat[r - 1][c + 1] === 1)  {
                trans++;
            }
            
            if (mat[r - 1][c + 1] === 0 && mat[r][c + 1] === 1) {
                trans++;
            }
            
            if (mat[r][c + 1] === 0 && mat[r + 1][c + 1] === 1) {
                trans++;
            } 
            
            if (mat[r + 1][c + 1] === 0 && mat[r + 1][c] === 1) {
                trans++;
            } 
            
            if (mat[r + 1][c] === 0 && mat[r + 1][c - 1] === 1) {
                trans++;
            } 
            
            if (mat[r + 1][c - 1] === 0 && mat[r][c - 1] === 1) {
                trans++;
            } 
            
            if (mat[r][c - 1] === 0 && mat[r - 1][c - 1] === 1) {
                trans++;
            } 
            
            if (mat[r - 1][c - 1] === 0 && mat[r - 1][c] === 1) {
                trans++;
            }

            return trans;
        }
        

        // function gpuIsAtLeastOneNumberBlankStep2(neighbors: number[]): boolean {
        //     const neighborBlankCondition1 = neighbors[0] === 0 || neighbors[2] === 0 || neighbors[6] === 0;
        //     const neighborBlankCondition2 = neighbors[0] === 0 || neighbors[4] === 0 || neighbors[7] === 0;
        
        //     return neighborBlankCondition1 && neighborBlankCondition2;
        // }
        
        function gpuRemovePoints(mat: number[][], removalMat: number[][], row: number, col: number): void {
            for (let i = 0; i < row; i++) {
                for (let j = 0; j < col; j++) {
                    if (removalMat[i][j] === 0) {
                        mat[i][j] = mat[0][0];
                    }
                }
            }

            for (let m = 0; m < row; m++) {
                for (let n = 0; n < col; n++) {
                    removalMat[m][n] = 1;
                }
            }
        }

        const gpu = new GPU();

        const thinning = gpu.createKernel(function(mat: number[][], removalMat: number[][]) {   
            const row = this.constants.row as number;
            const col = this.constants.col as number;
            
            let shouldRunStep1 = true;
            let hasPointsToRemove = false;

            do {
                hasPointsToRemove = false
                if (shouldRunStep1) {
                    for (let i = 0; i < row; i++) {
                        for (let j = 0; j < col; j++) {
                            if (i == 0 || j == 0 || i == row - 1 || j == col - 1) {
                                continue;
                            } else {
                                if (mat[i][j] === 1) {
                                    const sum = gpuSumOfNeighbors(mat, i, j);
                                    const trans = gpuNumberOfTransitions(mat, i, j);
                                    const neighborBlankCondition1 = mat[i - 1][j] === 0 || mat[i][j + 1]=== 0 || mat[i][j - 1] === 0;
                                    const neighborBlankCondition2 = mat[i - 1][j] === 0 || mat[i + 1][j + 1] === 0 || mat[i- 1][j - 1] === 0;

                                    const sumInRange = (sum <= 6 && sum >= 2);

                                    if (sumInRange && trans === 1 && neighborBlankCondition1 && neighborBlankCondition2) {
                                        removalMat[i][j] = 0;
                                        hasPointsToRemove = true;
                                    }
                                }
                            }
                        }
                    }

                    gpuRemovePoints(mat, removalMat, row, col);
                } else {
                    for (let i = 0; i < row; i++) {
                        for (let j = 0; j < col; j++) {
                            if (i == 0 || j == 0 || i == row - 1 || j == col - 1) {
                                continue;
                            } else {
                                if (mat[i][j] === 1) {
                                    const sum = gpuSumOfNeighbors(mat, i, j);
                                    const trans = gpuNumberOfTransitions(mat, i, j);
                                    const neighborBlankCondition1 = mat[i - 1][j] === 0 ||mat[i][j + 1]=== 0 || mat[i][j - 1] === 0;
                                    const neighborBlankCondition2 = mat[i - 1][j] === 0 || mat[i + 1][j] === 0 || mat[i - 1][j - 1] === 0;

                                    const sumInRange = (sum <= 6 && sum >= 2);

                                    if (sumInRange && trans === 1 && neighborBlankCondition1 && neighborBlankCondition2) {
                                        removalMat[this.thread.x][this.thread.y] = 0;
                                        hasPointsToRemove = true;
                                    }
                                }
                            }
                        }
                    }

                    gpuRemovePoints(mat, removalMat, row, col);
                }
        
                shouldRunStep1 = !shouldRunStep1;
            } while (!shouldRunStep1 || hasPointsToRemove);

            return mat[this.thread.y][this.thread.x];
        })
        .setPrecision('single')
        .setConstants({
            row: mat.length, 
            col:mat[0].length
        })
        .setOutput([mat[0].length, mat.length])
        .setFunctions([gpuSumOfNeighbors, gpuNumberOfTransitions, gpuRemovePoints]); // column first and then row // ; 
        
        mat = thinning(mat, removalMat) as number[][];
        logMat(mat);

        const endTime = Date.now();

        console.log("Done: took " + (endTime - startTime) + "ms");
        return mat;
    }
}
