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
    skeleton: string;
    strokes: string[];
}

export type SkeletifyResponse = SkeletifiedImage;

export enum COMPRESSION {
    GZIP = 'gzip',
}

export interface SkeletifyProcessor {
    thinning(bitMapBuffer: BitMapBuffer): Promise<Array<number[]>>;
}

export interface Point {
    r: number;
    c: number;
}
