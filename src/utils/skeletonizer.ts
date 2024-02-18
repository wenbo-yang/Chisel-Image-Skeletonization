import { Config } from '../config';
import { SkeletonizeProcessor } from '../types/skeletonizeTypes';
import { convert2DMatToString, logMat } from './imageProcessor/matUtilities';
import { SoftSkeletonizeProcessor } from './imageProcessor/softSkeletonizeProcessor';

export class Skeletonizer {
    private skeletonizeProcessor: SkeletonizeProcessor;
    private config: Config;

    constructor(config?: Config, skeletonizeProcessor?: SkeletonizeProcessor) {
        this.config = config || new Config();
        this.skeletonizeProcessor = skeletonizeProcessor || new SoftSkeletonizeProcessor(this.config);
    }

    public async skeletonizeImage(binaryMat: Array<number[]>): Promise<string> {
        const skeleton = await this.skeletonizeProcessor.thinning(binaryMat);

        return convert2DMatToString(skeleton);
    }
}
