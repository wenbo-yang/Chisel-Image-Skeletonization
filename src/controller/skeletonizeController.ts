import { Request } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { SkeletonizeModel } from '../model/skeletonizeModel';
import { SkeletonizeRequestBody, SkeletonizeResponse } from '../types/skeletonizeTypes';

export class SkeletonizeController {
    private skeletonizeModel: SkeletonizeModel;

    constructor(skeletonizeModel?: SkeletonizeModel) {
        this.skeletonizeModel = skeletonizeModel || new SkeletonizeModel();
    }

    public async skeletonize(req: Request<{}, any, any, ParsedQs, Record<string, any>>): Promise<SkeletonizeResponse> {
        // stubby
        const body = req.body as SkeletonizeRequestBody;
        const skeletonized = await this.skeletonizeModel.tryskeletonize(Buffer.from(body.data, 'base64'));
        
        return skeletonized;
    }
}
