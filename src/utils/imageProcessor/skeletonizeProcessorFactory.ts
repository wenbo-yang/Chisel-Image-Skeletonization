import { Config } from '../../config';
import { SkeletonizeProcessor } from '../../types/skeletonizeTypes';
import { GpuSkeletonizeProcessor } from './gpuSkeletonizeProcessor';
import { SoftSkeletonizeProcessor } from './softSkeletonizeProcessor';

export class SkeletonizeProcessorFactory {
    static makeSkeletonizeProcessor(config?: Config): SkeletonizeProcessor {
        return (config || new Config()).useGpuSkeletonizer ? new GpuSkeletonizeProcessor(config) : new SoftSkeletonizeProcessor(config);
    }
}
