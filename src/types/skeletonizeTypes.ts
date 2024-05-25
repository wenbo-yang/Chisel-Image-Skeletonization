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
    isPrimitive?: boolean;
    primitiveType?: PRIMITIVETYPE;
    offset: Point;
    stroke: string;
}

export enum TRANSFORMEDTYPE {
    ORIGINAL = 'ORIGINAL',
    PERIMETER = 'PERIMETER',
    SINGLESTROKE = 'SINGLESTROKE',
    SKELETON = 'SKELETON',
}

export enum PRIMITIVETYPE {
    POINT = 'POINT',
    LINE = 'LINE',
    ARC = 'ARC',
    TRIANGLE = 'TRIANGLE',
    SQUARE = 'SQUARE',
    RECTANGLE = 'RECTANGLE',
    PARALLELOGRAM = 'PARALLELEGRAM',
    TRAPEZOID = 'TRAPEZOID',
    QUADRILATERAL = 'QUADRILATERAL',
    PENTAGON = 'PENTAGON',
    HEXAGON = 'HEXAGON',
    HEPTAGON = 'HEPTAGON',
    OCTAGON = 'OCTAGON',
    POLYGON = 'POLYGON',
    CIRCLE = 'CIRCLE',
    ELLIPTICAL = 'ELLIPTICAL',
}

export enum SKELETONIZEREQUESTIMAGETYPE {
    PNG = 'PNG',
    BMP = 'BMP',
    BINARYSTRINGWITHNEWLINE = 'BINARYSTRINGWITHNEWLINE',
}

export type SkeletonizeResponse = SkeletonizedImage;

export enum COMPRESSION {
    GZIP = 'GZIP',
    NONE = 'NONE',
}

export interface SkeletonizeProcessor {
    thinning(binaryMat: Array<number[]>): Promise<Array<number[]>>;
}

export interface Point {
    r: number;
    c: number;
}

export interface ISkeletonizationServiceConfig {
    imageHeight: number;
    imageWidth: number;
    grayScaleWhiteThreshold: number;
    shortName: string;
    useGpuSkeletonizer: boolean;
    env: string;
    servicePorts: ServicePorts;
}

export interface ServiceConfig {
    serviceName: string;
    shortName: string;
}

export interface ServicePorts {
    http: number;
    https: number;
}
