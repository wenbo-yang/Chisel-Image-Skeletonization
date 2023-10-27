import { SkeletifiedImage } from '../types/skeletifyTypes';
import { BitMapBuffer } from '../utils/bitMapBuffer';
import { ImageConverter } from '../utils/imageProcessor/imageConverter';

export class SkeletifyModel {
    private imageConverter: ImageConverter;
    constructor(imageConverter?: ImageConverter) {
        this.imageConverter = imageConverter || new ImageConverter();
    }

    public async trySkeletify(data: Buffer): Promise<SkeletifiedImage> {
        const bitmapImage = await this.imageConverter.convertToBMP(data);

        return {
            skeleton: new BitMapBuffer(data),
            strokes: [new BitMapBuffer(data)],
        };
    }
}
