import { Request } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { SkeletifyModel } from '../model/skeletifyModel';
import { SkeletifyRequestBody, SkeletifyResponse } from '../types/skeletifyTypes';

export class SkeletifyController {
    private skeletifyModel: SkeletifyModel;

    constructor(skeletifyModel?: SkeletifyModel) {
        this.skeletifyModel = skeletifyModel || new SkeletifyModel();
    }

    public async skeletify(req: Request<{}, any, any, ParsedQs, Record<string, any>>): Promise<SkeletifyResponse> {
        // stubby
        const body = req.body as SkeletifyRequestBody;
        const skeletified = await this.skeletifyModel.trySkeletify(Buffer.from(body.data, 'base64'));
    
        return skeletified;
    }
}
