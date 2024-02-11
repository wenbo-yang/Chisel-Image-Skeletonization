import { Config } from '../../config';
import { SkeletifyProcessor } from '../../types/skeletifyTypes';
import { BitMapBuffer } from '../bitMapBuffer';

export class GpuSkeletifyProcessor implements SkeletifyProcessor {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async thinning(bitMapBuffer: BitMapBuffer): Promise<Array<number[]>> {
        throw new Error('Method not implemented.');
    }
}
