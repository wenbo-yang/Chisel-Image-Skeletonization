import { Config } from '../config';
import { BitMapBuffer } from './bitMapBuffer';
import { SkeletonizeProcessor } from '../types/skeletonizeTypes';
import { SoftSkeletonizeProcessor } from './imageProcessor/softSkeletonizeProcessor';

export class Skeletonizer {
    private config: Config;
    private skeletonizeProcessor: SkeletonizeProcessor;

    constructor(config?: Config, skeletonizeProcessor?: SkeletonizeProcessor) {
        this.config = config || new Config();
        this.skeletonizeProcessor = skeletonizeProcessor || new SoftSkeletonizeProcessor(config);
    }

    public async skeletonizeImage(bitmapImage: BitMapBuffer): Promise<string> {
        const skeleton = await this.skeletonizeProcessor.thinning(bitmapImage);

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
