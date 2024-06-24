import { convertMatToNewLineSeparatedString } from '../../Chisel-Global-Common-Libraries/src/lib/binaryMatUtils';
import { COMPRESSIONTYPE } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';
import { SkeletonizationServiceConfig } from '../config';
import { ISkeletonizationServiceConfig, SkeletonizeProcessor } from '../types/skeletonizeTypes';
import { SkeletonizeProcessorFactory } from './imageProcessor/skeletonizeProcessorFactory';

export class Skeletonizer {
    private skeletonizeProcessor: SkeletonizeProcessor;
    private config: ISkeletonizationServiceConfig;

    constructor(config?: ISkeletonizationServiceConfig, skeletonizeProcessor?: SkeletonizeProcessor) {
        this.config = config || new SkeletonizationServiceConfig();
        this.skeletonizeProcessor = skeletonizeProcessor || SkeletonizeProcessorFactory.makeSkeletonizeProcessor(this.config);
    }

    public async skeletonizeImage(binaryMat: Array<number[]>): Promise<number[][]> {
        const skeleton = await this.skeletonizeProcessor.thinning(binaryMat);
        return skeleton;
    }
}
