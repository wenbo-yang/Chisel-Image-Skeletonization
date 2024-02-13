import { gzip } from 'node-gzip';
import { COMPRESSION, SkeletonizedImage } from '../types/skeletonizeTypes';
import { ImageConverter } from '../utils/imageConverter/imageConverter';
import { Skeletonizer } from '../utils/skeletonizer';
import { logMat } from '../utils/imageProcessor/matUtilities';

export class SkeletonizeModel {
    private imageConverter: ImageConverter;
    private skeletonizer: Skeletonizer;
    constructor(imageConverter?: ImageConverter, skeletonizer?: Skeletonizer) {
        this.imageConverter = imageConverter || new ImageConverter();
        this.skeletonizer = skeletonizer || new Skeletonizer();
    }

    public async tryskeletonize(data: Buffer): Promise<SkeletonizedImage> {
        const bitmapImage = await this.imageConverter.convertAndResizeToBMP(data);
        const skeleton = await this.skeletonizer.skeletonizeImage(bitmapImage);
        const compressed = Buffer.from(await this.compress(bitmapImage.imageBuffer)).toString('base64');
        const compressedSkeleton = Buffer.from(await this.compress(Buffer.from(skeleton))).toString('base64')
;
        return {
            compression: COMPRESSION.GZIP,
            imageType: bitmapImage.imageType,
            grayScale: compressed,
            skeleton: compressedSkeleton,
            strokes: [compressed],
        };
    }
    
    private async compress(data: Buffer): Promise<Buffer> {
        return await gzip(data);
    }
}
