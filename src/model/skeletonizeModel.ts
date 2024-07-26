import { gzip, ungzip } from 'node-gzip';
import { ISkeletonizationServiceConfig, SkeletonizedImage, TRANSFORMEDTYPE } from '../types/skeletonizeTypes';
import { ImageConverter } from '../utils/imageConverter/imageConverter';
import { Skeletonizer } from '../utils/skeletonizer';
import { convertBitmapDataToZeroOneMat, convertMatToImage, convertMatToNewLineSeparatedString, convertNewLineSeparatedStringToImage } from '../../Chisel-Global-Common-Libraries/src/lib/binaryMatUtils';
import { PerimeterTracer } from '../utils/perimeterTracer';
import { SkeletonizationServiceConfig } from '../config';
import { COMPRESSIONTYPE, IMAGEDATATYPE } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';
import { Fattener } from '../utils/fattenStroker';

export class SkeletonizeModel {
    private imageConverter: ImageConverter;
    private skeletonizer: Skeletonizer;
    private config: ISkeletonizationServiceConfig;
    private perimeterTracer: PerimeterTracer;
    private fattener: Fattener;
    constructor(config?: ISkeletonizationServiceConfig, imageConverter?: ImageConverter, skeletonizer?: Skeletonizer, perimeterTracer?: PerimeterTracer, fattener?: Fattener) {
        this.config = config || new SkeletonizationServiceConfig();
        this.imageConverter = imageConverter || new ImageConverter(this.config);
        this.skeletonizer = skeletonizer || new Skeletonizer(this.config);
        this.perimeterTracer = perimeterTracer || new PerimeterTracer(this.config);
        this.fattener = fattener || new Fattener(this.config);
    }

    public async tryskeletonize(type: IMAGEDATATYPE, compression: COMPRESSIONTYPE, returnCompression: COMPRESSIONTYPE, data: Buffer, returnImageHeight?: number, returnImageWidth?: number, grayscaleWhiteThreshold?: number): Promise<SkeletonizedImage> {
        const bitmapImage = await this.imageConverter.convertAndResizeToBMP(type, compression === COMPRESSIONTYPE.GZIP ? await this.uncompress(data) : data, returnImageHeight, returnImageWidth, grayscaleWhiteThreshold);
        const binaryMat = await convertBitmapDataToZeroOneMat(bitmapImage.imageBuffer, this.config.grayScaleWhiteThreshold);
        const perimeters = await this.perimeterTracer.trace(binaryMat, returnCompression);
        const skeleton = await this.skeletonizer.skeletonizeImage(binaryMat);
        const boldSkeleton = await this.fattener.fatten(skeleton, returnCompression);

        return {
            compression: returnCompression,
            transformedData: perimeters.concat([
                { type: TRANSFORMEDTYPE.ORIGINAL, offset: { r: 0, c: 0 }, stroke: await convertMatToNewLineSeparatedString(binaryMat, returnCompression), strokeImage: await convertMatToImage(binaryMat, returnCompression) },
                {
                    type: TRANSFORMEDTYPE.SKELETON,
                    offset: { r: 0, c: 0 },
                    stroke: await convertMatToNewLineSeparatedString(skeleton, returnCompression),
                    strokeImage: await convertMatToImage(skeleton, returnCompression, true, this.config.grayScaleWhiteThreshold),
                },
                boldSkeleton,
            ]),
        };
    }

    private async uncompress(data: Buffer): Promise<Buffer> {
        return await ungzip(data);
    }
}
