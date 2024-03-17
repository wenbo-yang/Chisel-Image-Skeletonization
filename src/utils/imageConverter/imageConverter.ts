import Jimp from 'jimp';
import { BitMapBuffer } from '../bitMapBuffer';
import { Config } from '../../config';

export class ImageConverter {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async convertAndResizeToBMP(buffer: Buffer, convertedImageHeight?: number, convertedImageWidth?: number): Promise<BitMapBuffer> {
        const sourceImage = (await Jimp.read(Buffer.from(buffer))).grayscale();
        const bmpImage = sourceImage.bitmap;

        // get the box
        let top = Number.MAX_VALUE;
        let bottom = Number.MIN_VALUE;
        let right = Number.MIN_VALUE;
        let left = Number.MAX_VALUE;
        let index = 0;

        for (let i = 0; i < bmpImage.height; i++) {
            for (let j = 0; j < bmpImage.width; j++) {
                if ((bmpImage.data[index + 1] + bmpImage.data[index + 2] + bmpImage.data[index + 3]) / 3 <= this.config.grayScaleWhiteThreshold) {
                    top = Math.min(i, top);
                    bottom = Math.max(i, bottom);
                    left = Math.min(j, left);
                    right = Math.max(j, right);
                }

                index += 4;
            }
        }

        const imageHeight = convertedImageHeight || this.config.imageHeight;
        const imageWidth = convertedImageWidth || this.config.imageWidth;

        sourceImage.crop(left, top, right - left, bottom - top).resize(imageWidth - 2, imageHeight - 2);
        const imageWithWhiteBorder = new Jimp(imageWidth, imageHeight, 'white').blit(sourceImage, 1, 1);

        const data = await imageWithWhiteBorder.getBufferAsync(Jimp.MIME_BMP);
        return new BitMapBuffer(data, this.config.imageHeight, this.config.imageWidth);
    }
}
