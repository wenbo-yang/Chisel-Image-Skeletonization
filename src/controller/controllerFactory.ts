import { Config } from '../config';
import { SkeletonizeController } from './skeletonizeController';

export class ControllerFactory {
    static makeSkeletonizeController(config?: Config): SkeletonizeController {
        return new SkeletonizeController(config);
    }
}
