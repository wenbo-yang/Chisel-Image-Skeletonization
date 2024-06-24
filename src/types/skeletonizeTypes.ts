import { IMAGEDATATYPE, COMPRESSIONTYPE, Point } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';

export interface SkeletonizeRequestBody {
    name: string;
    type: IMAGEDATATYPE;
    compression: COMPRESSIONTYPE;
    data: string;
    grayScaleWhiteThreshold?: number;
    returnCompression: COMPRESSIONTYPE;
    returnImageHeight?: number;
    returnImageWidth?: number;
}

export interface SkeletonizedImage {
    compression: string;
    transformedData: Transformed[];
}

export interface Transformed {
    type: TRANSFORMEDTYPE;
    isPrimitive?: boolean;
    primitiveType?: PRIMITIVETYPE;
    offset: Point;
    stroke: string;
    strokeImage: string;
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

export type SkeletonizeResponse = SkeletonizedImage;

export interface SkeletonizeProcessor {
    thinning(binaryMat: Array<number[]>): Promise<Array<number[]>>;
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
