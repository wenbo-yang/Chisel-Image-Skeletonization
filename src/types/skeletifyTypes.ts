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
    grayScale: string;
    skeletonImageHeight: number;
    skeletonImageWidth: number;
    skeleton: number[][];
    strokes: string[];
}

export type SkeletifyResponse = SkeletifiedImage;

export enum COMPRESSION {
    GZIP = 'gzip',
}

export interface SkeletifyProcessor {
    thinning(bitMapBuffer: BitMapBuffer): Promise<Array<number[]>>;
}

import { Config } from '../config';

export class RuleSet {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }
}

export interface Point {
    r: number;
    c: number;
}
