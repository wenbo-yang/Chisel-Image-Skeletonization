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
    strokes: Strokes[];
}

export interface Strokes {
    type: STROKETYPE;
    offset: Point;
    stroke: string;
}

export enum STROKETYPE {
    PERIMETER = 'PERIMETER',
    SINGLESTROKE = 'SINGLESTROKE',
}

export type SkeletonizeResponse = SkeletonizedImage;

export enum COMPRESSION {
    GZIP = 'gzip',
}

export interface SkeletonizeProcessor {
    thinning(binaryMat: Array<number[]>): Promise<Array<number[]>>;
}

export interface Point {
    r: number;
    c: number;
}
