export interface SkeletonizeRequestBody {
    name: string;
    type: string;
    compression: string;
    data: string;
    returnImageHeight?: number;
    returnImageWidth?: number;
}

export interface SkeletonizedImage {
    imageType: string;
    compression: string;
    grayScale: string;
    transformedData: Transformed[];
}

export interface Transformed {
    type: TRANSFORMEDTYPE;
    offset: Point;
    stroke: string;
}

export enum TRANSFORMEDTYPE {
    ORIGINAL = 'ORIGINAL',
    PERIMETER = 'PERIMETER',
    SINGLESTROKE = 'SINGLESTROKE',
    SKELETON = 'SKELETON',
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
