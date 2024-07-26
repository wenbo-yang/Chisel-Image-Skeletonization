import Jimp from 'jimp';
import { COMPRESSIONTYPE, Point } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';
import { SkeletonizationServiceConfig } from '../config';
import { ISkeletonizationServiceConfig, Transformed, TRANSFORMEDTYPE } from '../types/skeletonizeTypes';
import { convertBitmapDataToZeroOneMat, convertMatToImage, convertMatToNewLineSeparatedString } from '../../Chisel-Global-Common-Libraries/src/lib/binaryMatUtils';

export class Fattener {
    private config: ISkeletonizationServiceConfig;

    constructor(config?: ISkeletonizationServiceConfig) {
        this.config = config || new SkeletonizationServiceConfig();
    }

    public async fatten(binaryMat: number[][], returnCompression: COMPRESSIONTYPE): Promise<Transformed> {
        const height = binaryMat.length;
        const width = binaryMat[0].length;

        const jimp = new Jimp(width, height, 'white');
        const hexBlackColor = Jimp.rgbaToInt(1, 1, 1, 255);

        const fattenRadius = this.config.fattenRadius;

        for (let i = 0; i < jimp.bitmap.height; i++) {
            for (let j = 0; j < jimp.bitmap.width; j++) {
                if (binaryMat[i][j] === 1) {
                    const points = this.calculateBasedOnRadius(i, j, fattenRadius, binaryMat);
                    for (const point of points) {
                        jimp.setPixelColor(hexBlackColor, point.c, point.r);
                    }
                }
            }
        }

        const fattenedBinaryMat = await convertBitmapDataToZeroOneMat(await jimp.getBufferAsync(Jimp.MIME_BMP), this.config.grayScaleWhiteThreshold);

        return {
            type: TRANSFORMEDTYPE.FATTENEDSKELETON,
            offset: { r: 0, c: 0 },
            stroke: await convertMatToNewLineSeparatedString(fattenedBinaryMat, returnCompression),
            strokeImage: await convertMatToImage(fattenedBinaryMat, returnCompression, true, this.config.grayScaleWhiteThreshold),
        };
    }

    private calculateBasedOnRadius(i: number, j: number, fattenRadius: number, binaryMat: number[][]): Point[] {
        const blastRadius: Point[] = [];
        for (let r = i - fattenRadius; r <= i + fattenRadius; r++) {
            for (let c = j - fattenRadius; c <= j + fattenRadius; c++) {
                // make sure it is within bolder, and it is within fatten radius
                if (r < binaryMat.length - 1 && r > 0 && c < binaryMat[0].length - 1 && c > 0 && (r - i) * (r - i) + (c - j) * (c - j) <= fattenRadius * fattenRadius) {
                    blastRadius.push({ r, c });
                }
            }
        }

        return blastRadius;
    }
}
