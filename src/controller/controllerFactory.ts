import { SkeletonizeController } from './skeletonizeController';

export class ControllerFactory {
    static makeSkeletonizeController(): SkeletonizeController {
        return new SkeletonizeController();
    }
}
