import { Config } from '../../config';
import { BitMapBuffer } from '../bitMapBuffer';
import { SkeletonizeProcessor } from '../../types/skeletonizeTypes';
import * as matUtilities from './matUtilities';
import { zsThinning } from './zsThinning';

export class SoftSkeletonizeProcessor implements SkeletonizeProcessor {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async thinning(binaryMat: Array<number[]>): Promise<Array<number[]>> {
        // const startTime = Date.now();
        let mat: number[][] = binaryMat.map((row) => row.slice());
        mat = zsThinning(mat);
        // const endTime = Date.now();
        // console.log("Done: took " + (endTime - startTime) + "ms");
        return mat;
    }
}
