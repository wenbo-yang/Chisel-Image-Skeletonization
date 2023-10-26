import { BitMapBuffer } from '../utils/bitMapBuffer';

export interface SkeletifyResponse {
    imageType: string;
    skeleton: Buffer;
    strokes: Buffer[];
}

export interface SkeletifyRequestBody {
    name: string;
    type: string;
    data: Buffer;
}

export interface SkeletifiedImage {
    skeleton: BitMapBuffer;
    strokes: BitMapBuffer;
}
