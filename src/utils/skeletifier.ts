import { Config } from '../config';
import { BitMapBuffer } from './bitMapBuffer';
import { SkeletifyProcessor } from '../types/skeletifyTypes';
import { SoftSkeletifyProcessor } from './imageProcessor/softSkeletifyProcessor';

export class Skeletifier {
    private config: Config;
    private skeletifyProcessor: SkeletifyProcessor;

    constructor(config?: Config, skeletifyProcessor?: SkeletifyProcessor) {
        this.config = config || new Config();
        this.skeletifyProcessor = skeletifyProcessor || new SoftSkeletifyProcessor(config);
    }

    public async skeletifyImage(bitmapImage: BitMapBuffer): Promise<BitMapBuffer> {
        return await this.skeletifyProcessor.thinning(bitmapImage);
    }
}
