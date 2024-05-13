export interface SkeletonizeRequestBody {
    name: string;
    type: SKELETONIZEREQUESTIMAGETYPE;
    compression: COMPRESSION;
    data: string;
    returnCompression: COMPRESSION;
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

export enum SKELETONIZEREQUESTIMAGETYPE {
    PNG = 'PNG',
    BMP = 'BMP',
    BINARYSTRINGWITHNEWLINE = 'BINARYSTRINGWITHNEWLINE'
}

export type SkeletonizeResponse = SkeletonizedImage;

export enum COMPRESSION {
    GZIP = 'GZIP',
    NONE = 'NONE'
}

export interface SkeletonizeProcessor {
    thinning(binaryMat: Array<number[]>): Promise<Array<number[]>>;
}

export interface Point {
    r: number;
    c: number;
}


