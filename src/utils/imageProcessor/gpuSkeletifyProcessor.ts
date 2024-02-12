import { Config } from '../../config';
import { SkeletifyProcessor } from '../../types/skeletifyTypes';
import { BitMapBuffer } from '../bitMapBuffer';
import { GPU } from 'gpu.js';
import { convertDataToZeroOneMat, logMat } from './matUtilities';
import { zsThinning } from './zsThinning';

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

        const thinning = new GPU().createKernel(zsThinning).setOutput([mat.length, mat[0].length]);
        mat = thinning(mat, [mat.length, mat[0].length]) as number[][];
        const endTime = Date.now();

        logMat(mat);

        console.log("Done: took " + (endTime - startTime) + "ms");
        return mat;
    }
}
