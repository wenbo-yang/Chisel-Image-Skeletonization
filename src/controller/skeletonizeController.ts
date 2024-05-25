import { Request } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { SkeletonizeModel } from '../model/skeletonizeModel';
import { ISkeletonizationServiceConfig, SkeletonizeRequestBody, SkeletonizeResponse } from '../types/skeletonizeTypes';
import { SkeletonizationServiceConfig } from '../config';

export class SkeletonizeController {

    private skeletonizeModel: SkeletonizeModel;
    private config: ISkeletonizationServiceConfig;

    constructor(config?: ISkeletonizationServiceConfig, skeletonizeModel?: SkeletonizeModel) {
        this.config = config || new SkeletonizationServiceConfig();
        this.skeletonizeModel = skeletonizeModel || new SkeletonizeModel(this.config);
    }

    public async skeletonize(req: Request<{}, any, any, ParsedQs, Record<string, any>>): Promise<SkeletonizeResponse> {
        const body = req.body as SkeletonizeRequestBody;
        const skeletonized = await this.skeletonizeModel.tryskeletonize(body.type, body.compression, body.returnCompression, Buffer.from(body.data, 'base64'), body.returnImageHeight, body.returnImageWidth);

        return skeletonized;
    }

    public async upsertPrimitiveDetectorModel(req: Request<{}, any, any, ParsedQs, Record<string, any>>): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
