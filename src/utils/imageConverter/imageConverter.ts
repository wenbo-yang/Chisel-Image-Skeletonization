import Jimp from 'jimp';
import { BitMapBuffer } from '../bitMapBuffer';
import { Config } from '../../config';
import { decode, encode } from 'bmp-js';

export class ImageConverter {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async convertAndResizeToBMP(buffer: Buffer): Promise<BitMapBuffer> {
        const jimp = await Jimp.read(Buffer.from(buffer));
        const bmpImage = decode(await jimp.grayscale().getBufferAsync(Jimp.MIME_BMP));

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

        jimp.crop(left, top, right - left, bottom - top).resize(this.config.imageWidth, this.config.imageHeight);

        const data = await jimp.grayscale().getBufferAsync(Jimp.MIME_BMP);
        return new BitMapBuffer(data, this.config.imageHeight, this.config.imageWidth);
    }
}
