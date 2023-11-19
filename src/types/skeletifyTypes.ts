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
    GZIP = 'gzip'
}