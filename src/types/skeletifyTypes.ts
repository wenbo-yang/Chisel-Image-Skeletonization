import { BitMapBuffer } from '../utils/bitMapBuffer';

export interface SkeletifyRequestBody {
    name: string;
    type: string;
    compression: string;
    data: string;
}

export interface SkeletifiedImage {
    imageType: string;
    compression: string;
    skeleton: string;
    strokes: string[];
}

export type SkeletifyResponse = SkeletifiedImage;

export enum COMPRESSION {
    GZIP = 'gzip',
}

export interface SkeletifyProcessor {
    thinning(bitMapBuffer: BitMapBuffer): Promise<BitMapBuffer>;
}

import { Config } from '../config';

export class RuleSet {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }
}
