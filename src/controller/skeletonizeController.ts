import { Request } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { SkeletonizeModel } from '../model/skeletonizeModel';
import { SkeletonizeRequestBody, SkeletonizeResponse } from '../types/skeletonizeTypes';
import { Config } from '../config';

export class SkeletonizeController {
    private skeletonizeModel: SkeletonizeModel;
    private config: Config;

    constructor(config?: Config, skeletonizeModel?: SkeletonizeModel) {
        this.config = config || new Config();
        this.skeletonizeModel = skeletonizeModel || new SkeletonizeModel(this.config);
    }

    public async skeletonize(req: Request<{}, any, any, ParsedQs, Record<string, any>>): Promise<SkeletonizeResponse> {
        const body = req.body as SkeletonizeRequestBody;
        const skeletonized = await this.skeletonizeModel.tryskeletonize(Buffer.from(body.data, 'base64'));

        return skeletonized;
    }
}
