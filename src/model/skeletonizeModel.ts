import { gzip } from 'node-gzip';
import { COMPRESSION, STROKETYPE, SkeletonizedImage } from '../types/skeletonizeTypes';
import { ImageConverter } from '../utils/imageConverter/imageConverter';
import { Skeletonizer } from '../utils/skeletonizer';
import { convert2DMatToString, convertDataToZeroOneMat, logMat } from '../utils/imageProcessor/matUtilities';
import { Config } from '../config';
import { PerimeterTracer } from '../utils/perimeterTracer';

export class SkeletonizeModel {
    private imageConverter: ImageConverter;
    private skeletonizer: Skeletonizer;
    private config: Config;
    private perimeterTracer: PerimeterTracer;
    constructor(config?: Config, imageConverter?: ImageConverter, skeletonizer?: Skeletonizer, perimeterTracer?: PerimeterTracer) {
        this.config = config || new Config();
        this.imageConverter = imageConverter || new ImageConverter(this.config);
        this.skeletonizer = skeletonizer || new Skeletonizer(this.config);
        this.perimeterTracer = perimeterTracer || new PerimeterTracer(this.config);
    }

    public async tryskeletonize(data: Buffer, returnImageHeight?: number, returnImageWidth?: number): Promise<SkeletonizedImage> {
        const bitmapImage = await this.imageConverter.convertAndResizeToBMP(data, returnImageHeight, returnImageWidth);
        const binaryMat = await convertDataToZeroOneMat(bitmapImage, this.config.grayScaleWhiteThreshold);
        const perimeters = await this.perimeterTracer.trace(binaryMat);
        const skeleton = await this.skeletonizer.skeletonizeImage(binaryMat);

        const compressed = Buffer.from(await this.compress(bitmapImage.imageBuffer)).toString('base64');

        return {
            compression: COMPRESSION.GZIP,
            imageType: bitmapImage.imageType,
            grayScale: compressed,
            skeleton: skeleton,
            strokes: perimeters.concat([{type: STROKETYPE.ORIGINAL, offset: {r:0, c:0}, stroke: convert2DMatToString(binaryMat)}]),
        };
    }

    private async compress(data: Buffer): Promise<Buffer> {
        return await gzip(data);
    }
}
