import { gzip } from 'node-gzip';
import { COMPRESSION, SkeletifiedImage } from '../types/skeletifyTypes';
import { ImageConverter } from '../utils/imageConverter/imageConverter';
import { Skeletifier } from '../utils/skeletifier';

export class SkeletifyModel {
    private imageConverter: ImageConverter;
    private skeletifier: Skeletifier;
    constructor(imageConverter?: ImageConverter, skeletifier?: Skeletifier) {
        this.imageConverter = imageConverter || new ImageConverter();
        this.skeletifier = skeletifier || new Skeletifier();
    }

    public async trySkeletify(data: Buffer): Promise<SkeletifiedImage> {
        const bitmapImage = await this.imageConverter.convertAndResizeToBMP(data);
        const skeleton = await this.skeletifier.skeletifyImage(bitmapImage);

        const compressed = Buffer.from(await this.compress(bitmapImage.imageBuffer)).toString('base64');
        const strokes = Buffer.from(await this.compress(skeleton.imageBuffer)).toString('base64');

        return {
            compression: COMPRESSION.GZIP,
            imageType: bitmapImage.imageType,
            skeleton: compressed,
            strokes: [strokes],
        };
    }

    async compress(data: Buffer): Promise<Buffer> {
        return await gzip(data);
    }
}
