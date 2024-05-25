import { SkeletonizationServiceConfig } from '../config';
import { ISkeletonizationServiceConfig } from './skeletonizeTypes';

export class RuleSet {
    private config: ISkeletonizationServiceConfig;

    constructor(config?: ISkeletonizationServiceConfig) {
        this.config = config || new SkeletonizationServiceConfig();
    }
}
