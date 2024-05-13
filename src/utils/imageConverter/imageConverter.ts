import Jimp from 'jimp';
import { BitMapBuffer } from '../bitMapBuffer';
import { Config } from '../../config';
import { SKELETONIZEREQUESTIMAGETYPE } from '../../types/skeletonizeTypes';

export class ImageConverter {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async convertAndResizeToBMP(type: SKELETONIZEREQUESTIMAGETYPE, buffer: Buffer, convertedImageHeight?: number, convertedImageWidth?: number): Promise<BitMapBuffer> {
        const sourceImage = (type === SKELETONIZEREQUESTIMAGETYPE.PNG || type === SKELETONIZEREQUESTIMAGETYPE.BMP) ? (await Jimp.read(Buffer.from(buffer))).grayscale() : this.convertToBitMapImage(type, buffer);
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

    private convertToBitMapImage(type: SKELETONIZEREQUESTIMAGETYPE, buffer: Buffer): Jimp {
        if (type !== SKELETONIZEREQUESTIMAGETYPE.BINARYSTRINGWITHNEWLINE) {
            throw Error('unsupported type ' + type);
        }

        const binaryStringWithNewLine = buffer.toString();
        const binaryMat = binaryStringWithNewLine.split('\n');

        const rows = binaryMat.length;
        const cols = binaryMat[0].length;
        
        const bmpImage = new Jimp(cols, rows, 'white').bitmap

        let index = 0

        for (let i = 0; i < bmpImage.height; i++) {
            for (let j = 0; j < bmpImage.width; j++) {
                if (binaryMat[i].charAt(j) === '1') {
                    bmpImage.data[index + 1] = bmpImage.data[index + 2] = bmpImage.data[index + 3] = 0; // 0 for black 
                }

                index += 4
            }
        }

        return new Jimp(bmpImage);
    }
}
