import { SkeletifyController } from './skeletifyController';

export class ControllerFactory {
    static makeSkeletifyController(): SkeletifyController {
        return new SkeletifyController();
    }
}
