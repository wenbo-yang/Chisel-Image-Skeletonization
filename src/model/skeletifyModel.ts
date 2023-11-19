import { gzip } from 'node-gzip';
import { COMPRESSION, SkeletifiedImage } from '../types/skeletifyTypes';
import { ImageConverter } from '../utils/imageProcessor/imageConverter';

export class SkeletifyModel {
    private imageConverter: ImageConverter;
    constructor(imageConverter?: ImageConverter) {
        this.imageConverter = imageConverter || new ImageConverter();
    }

    public async trySkeletify(data: Buffer): Promise<SkeletifiedImage> {
        const bitmapImage = await this.imageConverter.convertToBMP(data);

        const compressed = Buffer.from(await this.compress(bitmapImage.imageBuffer)).toString('base64');

        return {
            compression: COMPRESSION.GZIP,
            imageType: bitmapImage.imageType,
            skeleton: compressed,
            strokes: [ compressed ],
        };
    }

    async compress(data: Buffer): Promise<Buffer> {
        return await gzip(data);
    }

}


