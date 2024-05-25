import { SkeletonizationServiceConfig } from '../config';
import { ISkeletonizationServiceConfig } from '../types/skeletonizeTypes';
import { SkeletonizeController } from './skeletonizeController';

export class ControllerFactory {
    static makeSkeletonizeController(config?: ISkeletonizationServiceConfig): SkeletonizeController {
        return new SkeletonizeController(config || new SkeletonizationServiceConfig());
    }
}
