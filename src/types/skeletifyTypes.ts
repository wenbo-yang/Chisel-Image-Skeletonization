import { BitMapBuffer } from '../utils/bitMapBuffer';

export type SkeletifyResponse = SkeletifiedImage;

export interface SkeletifyRequestBody {
    name: string;
    type: string;
    data: Buffer;
}

export interface SkeletifiedImage {
    skeleton: BitMapBuffer;
    strokes: BitMapBuffer[];
}
