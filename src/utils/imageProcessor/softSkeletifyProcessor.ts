import { Config } from '../../config';
import { BitMapBuffer } from '../bitMapBuffer';
import { SkeletifyProcessor } from '../../types/skeletifyTypes';
import * as matUtilities from './matUtilities';
import { zsThinning } from './zsThinning';

export class SoftSkeletifyProcessor implements SkeletifyProcessor {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async thinning(bitMapBuffer: BitMapBuffer): Promise<Array<number[]>> {
        let mat = await matUtilities.convertDataToZeroOneMat(bitMapBuffer, this.config.grayScaleWhiteThreshold);
        
        mat = zsThinning(mat);

        return mat;
    }
}
