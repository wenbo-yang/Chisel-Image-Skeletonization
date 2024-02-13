import { BitMapBuffer } from '../utils/bitMapBuffer';

export interface SkeletonizeRequestBody {
    name: string;
    type: string;
    compression: string;
    data: string;
}

export interface SkeletonizedImage {
    imageType: string;
    compression: string;
    grayScale: string;
    skeleton: string;
    strokes: string[];
}

export type SkeletonizeResponse = SkeletonizedImage;

export enum COMPRESSION {
    GZIP = 'gzip',
}

export interface SkeletonizeProcessor {
    thinning(bitMapBuffer: BitMapBuffer): Promise<Array<number[]>>;
}

export interface Point {
    r: number;
    c: number;
}
