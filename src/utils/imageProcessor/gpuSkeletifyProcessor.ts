import { Config } from '../../config';
import { Point, SkeletifyProcessor } from '../../types/skeletifyTypes';
import { BitMapBuffer } from '../bitMapBuffer';
import { GPU } from 'gpu.js';
import { convertDataToZeroOneMat, logMat } from './matUtilities';
import { zsThinnigGetTargetPointsStep1, zsThinnigGetTargetPointsStep2, zsThinning } from './zsThinning';
import { constants } from 'buffer';

// NOTE: THIS IS NOT FASTER THAN CPU FOR OUR APPLICATION
// WILL NOT USE THIS for V1
// Manipulating matrix element breaks GPU rule... this is algorithm is not going to work.

export class GpuSkeletifyProcessor implements SkeletifyProcessor {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async thinning(bitMapBuffer: BitMapBuffer): Promise<Array<number[]>> {
        // const startTime = Date.now();
        let mat = await convertDataToZeroOneMat(bitMapBuffer, this.config.grayScaleWhiteThreshold);
        let removalMat: number[][] = Array<number[]>(mat.length)
            .fill([])
            .map(() => Array<number>(mat[0].length).fill(1));

        const gpu = new GPU();
        const gpuRemovalMat = gpu
            .createKernel(function (mat: number[][], removalMat: number[][]) {
                const out = mat[this.thread.y][this.thread.x] & removalMat[this.thread.y][this.thread.x];
                return out;
            })
            .setPrecision('single')
            .setOutput([mat[0].length, mat.length]);

        let pointsToRemove: Point[] = [];
        let shouldRunStep1 = true;
        do {
            pointsToRemove = [];
            if (shouldRunStep1) {
                pointsToRemove = zsThinnigGetTargetPointsStep1(mat);
                this.applyPointsToRemoveToRemovalMat(pointsToRemove, removalMat);
                mat = gpuRemovalMat(mat, removalMat) as number[][];
            } else {
                pointsToRemove = zsThinnigGetTargetPointsStep2(mat);
                this.applyPointsToRemoveToRemovalMat(pointsToRemove, removalMat);
                mat = gpuRemovalMat(mat, removalMat) as number[][];
            }
            shouldRunStep1 = !shouldRunStep1;
        } while (!shouldRunStep1 || pointsToRemove.length !== 0);

        // const endTime = Date.now();
        // console.log('Done: took ' + (endTime - startTime) + 'ms');

        const retMat = this.convertToNumberMat(mat);

        return retMat;
    }

    private applyPointsToRemoveToRemovalMat(pointsToRemove: Point[], removalMat: number[][]) {
        for (let i = 0; i < pointsToRemove.length; i++) {
            removalMat[pointsToRemove[i].r][pointsToRemove[i].c] = 0;
        }
    }

    private convertToNumberMat(mat: number[][]) {
        const retMat: number[][] = Array<number[]>(mat.length)
            .fill([])
            .map(() => Array<number>(mat[0].length).fill(0));

        for (let i = 0; i < mat.length; i++) {
            for (let j = 0; j < mat[0].length; j++) {
                retMat[i][j] = mat[i][j];
            }
        }

        return retMat;
    }
}
