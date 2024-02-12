import { Config } from '../../config';
import { SkeletifyProcessor } from '../../types/skeletifyTypes';
import { BitMapBuffer } from '../bitMapBuffer';
import { GPU } from 'gpu.js';
import { convertDataToZeroOneMat } from './matUtilities';
import { zsThinning } from './zsThinning';

export class GpuSkeletifyProcessor implements SkeletifyProcessor {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async thinning(bitMapBuffer: BitMapBuffer): Promise<Array<number[]>> {
        let mat = await convertDataToZeroOneMat(bitMapBuffer, this.config.grayScaleWhiteThreshold);
        const thinning = new GPU().createKernel(zsThinning).setOutput([mat.length, mat[0].length]);
        mat = thinning(mat) as number[][];

        return mat;
    }
}
