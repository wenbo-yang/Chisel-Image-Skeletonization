import { gzip, ungzip } from 'node-gzip';
import { ISkeletonizationServiceConfig, SkeletonizedImage, TRANSFORMEDTYPE } from '../types/skeletonizeTypes';
import { ImageConverter } from '../utils/imageConverter/imageConverter';
import { Skeletonizer } from '../utils/skeletonizer';
import { convertBitmapDataToZeroOneMat, convertMatToImage, convertMatToNewLineSeparatedString, convertNewLineSeparatedStringToImage } from '../../Chisel-Global-Common-Libraries/src/lib/binaryMatUtils';
import { PerimeterTracer } from '../utils/perimeterTracer';
import { SkeletonizationServiceConfig } from '../config';
import { COMPRESSIONTYPE, IMAGEDATATYPE } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';

export class SkeletonizeModel {
    private imageConverter: ImageConverter;
    private skeletonizer: Skeletonizer;
    private config: ISkeletonizationServiceConfig;
    private perimeterTracer: PerimeterTracer;
    constructor(config?: ISkeletonizationServiceConfig, imageConverter?: ImageConverter, skeletonizer?: Skeletonizer, perimeterTracer?: PerimeterTracer) {
        this.config = config || new SkeletonizationServiceConfig();
        this.imageConverter = imageConverter || new ImageConverter(this.config);
        this.skeletonizer = skeletonizer || new Skeletonizer(this.config);
        this.perimeterTracer = perimeterTracer || new PerimeterTracer(this.config);
    }

    public async tryskeletonize(type: IMAGEDATATYPE, compression: COMPRESSIONTYPE, returnCompression: COMPRESSIONTYPE, data: Buffer, returnImageHeight?: number, returnImageWidth?: number, grayscaleWhiteThreshold?: number): Promise<SkeletonizedImage> {
        const bitmapImage = await this.imageConverter.convertAndResizeToBMP(type, compression === COMPRESSIONTYPE.GZIP ? await this.uncompress(data) : data, returnImageHeight, returnImageWidth, grayscaleWhiteThreshold);
        const binaryMat = await convertBitmapDataToZeroOneMat(bitmapImage.imageBuffer, this.config.grayScaleWhiteThreshold);
        const perimeters = await this.perimeterTracer.trace(binaryMat, returnCompression);
        const skeleton = await this.skeletonizer.skeletonizeImage(binaryMat);
        const grayScaleImageData = Buffer.from(returnCompression === COMPRESSIONTYPE.GZIP ? await this.compress(bitmapImage.imageBuffer) : bitmapImage.imageBuffer).toString('base64');
        return {
            compression: returnCompression,
            imageType: bitmapImage.imageType,
            grayScale: grayScaleImageData,
            transformedData: perimeters.concat([
                { type: TRANSFORMEDTYPE.ORIGINAL, offset: { r: 0, c: 0 }, stroke: convertMatToNewLineSeparatedString(binaryMat), strokeImage: await convertMatToImage(binaryMat, returnCompression)},
                {
                    type: TRANSFORMEDTYPE.SKELETON,
                    offset: { r: 0, c: 0 },
                    stroke: skeleton,
                    strokeImage: await convertNewLineSeparatedStringToImage(skeleton, returnCompression),
                },
            ]),
        };
    }

    private async compress(data: Buffer): Promise<Buffer> {
        return await gzip(data);
    }

    private async uncompress(data: Buffer): Promise<Buffer> {
        return await ungzip(data);
    }
}
