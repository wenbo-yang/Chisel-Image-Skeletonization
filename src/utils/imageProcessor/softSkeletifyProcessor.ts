import { Config } from '../../config';
import { SkeletifyProcessor } from '../../types/skeletifyTypes';
import { BitMapBuffer } from '../bitMapBuffer';


export class SoftSkeletifyProcessor implements SkeletifyProcessor {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async thinning(bitMapBuffer: BitMapBuffer): Promise<BitMapBuffer> {
        // console.log(bitMapBuffer.imageBuffer);

        return bitMapBuffer;
    }
}
