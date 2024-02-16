import { gzip } from 'node-gzip';
import { COMPRESSION, SkeletonizedImage } from '../types/skeletonizeTypes';
import { ImageConverter } from '../utils/imageConverter/imageConverter';
import { Skeletonizer } from '../utils/skeletonizer';
import { convertDataToZeroOneMat, logMat } from '../utils/imageProcessor/matUtilities';
import { Config } from '../config';

export class SkeletonizeModel {
    private imageConverter: ImageConverter;
    private skeletonizer: Skeletonizer;
    private config: Config;
    constructor(config?: Config, imageConverter?: ImageConverter, skeletonizer?: Skeletonizer, ) {
        this.imageConverter = imageConverter || new ImageConverter();
        this.skeletonizer = skeletonizer || new Skeletonizer();
        this.config = config || new Config();
    }

    public async tryskeletonize(data: Buffer): Promise<SkeletonizedImage> {
        const bitmapImage = await this.imageConverter.convertAndResizeToBMP(data);
        const binaryMat = await convertDataToZeroOneMat(bitmapImage, this.config.grayScaleWhiteThreshold);
        
        const skeleton = await this.skeletonizer.skeletonizeImage(binaryMat);
        
        const compressed = Buffer.from(await this.compress(bitmapImage.imageBuffer)).toString('base64');
        const compressedSkeleton = Buffer.from(await this.compress(Buffer.from(skeleton))).toString('base64');
        return {
            compression: COMPRESSION.GZIP,
            imageType: bitmapImage.imageType,
            grayScale: compressed,
            skeleton: compressedSkeleton,
            strokes: [],
        };
    }

    private async compress(data: Buffer): Promise<Buffer> {
        return await gzip(data);
    }
}
