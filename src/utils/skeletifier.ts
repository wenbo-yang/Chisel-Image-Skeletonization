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

    public async skeletifyImage(bitmapImage: BitMapBuffer): Promise<string> {
        const skeleton = await this.skeletifyProcessor.thinning(bitmapImage);

        return this.convert2DMatToString(skeleton);

    }

    private convert2DMatToString(skeleton: number[][]): string {
        let output = '';

        for (let i = 0; i < skeleton.length; i++) {
            for (let j = 0; j < skeleton[0].length; j++) {
                output += skeleton[i][j].toString();
            }
            if (i != skeleton.length - 1) {
                output += '\n';
            }
        }

        return output
    }
}
