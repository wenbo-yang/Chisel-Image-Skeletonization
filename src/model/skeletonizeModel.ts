import { gzip } from 'node-gzip';
import { COMPRESSION, SkeletonizedImage } from '../types/skeletonizeTypes';
import { ImageConverter } from '../utils/imageConverter/imageConverter';
import { Skeletonizer } from '../utils/skeletonizer';
import { convertDataToZeroOneMat, logMat } from '../utils/imageProcessor/matUtilities';
import { Config } from '../config';
import { ContourTracer } from '../utils/contourTracer';

export class SkeletonizeModel {
    private imageConverter: ImageConverter;
    private skeletonizer: Skeletonizer;
    private config: Config;
    private contourTracer: ContourTracer;
    constructor(config?: Config, imageConverter?: ImageConverter, skeletonizer?: Skeletonizer, contourTracer?: ContourTracer) {
        this.config = config || new Config();
        this.imageConverter = imageConverter || new ImageConverter(this.config);
        this.skeletonizer = skeletonizer || new Skeletonizer(this.config);
        this.contourTracer = contourTracer || new ContourTracer(this.config);
    }

    public async tryskeletonize(data: Buffer): Promise<SkeletonizedImage> {
        const bitmapImage = await this.imageConverter.convertAndResizeToBMP(data);
        const binaryMat = await convertDataToZeroOneMat(bitmapImage, this.config.grayScaleWhiteThreshold);

        const contours = await this.contourTracer.trace(binaryMat);
        const skeleton = await this.skeletonizer.skeletonizeImage(binaryMat);

        const compressed = Buffer.from(await this.compress(bitmapImage.imageBuffer)).toString('base64');

        return {
            compression: COMPRESSION.GZIP,
            imageType: bitmapImage.imageType,
            grayScale: compressed,
            skeleton: skeleton,
            strokes: contours,
        };
    }

    private async compress(data: Buffer): Promise<Buffer> {
        return await gzip(data);
    }
}
