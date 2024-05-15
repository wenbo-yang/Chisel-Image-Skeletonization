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
        let sourceImage: Jimp;
        if (type === SKELETONIZEREQUESTIMAGETYPE.PNG || type === SKELETONIZEREQUESTIMAGETYPE.BMP) {
            sourceImage = (await Jimp.read(Buffer.from(buffer))).grayscale();
        } else {
            sourceImage = this.convertToBitmapGrayImage(type, buffer).grayscale();
        }

        // get the box
        let top = Number.MAX_VALUE;
        let bottom = Number.MIN_VALUE;
        let right = Number.MIN_VALUE;
        let left = Number.MAX_VALUE;

        for (let i = 0; i < sourceImage.getHeight(); i++) {
            for (let j = 0; j < sourceImage.getWidth(); j++) {
                const rgba = Jimp.intToRGBA(sourceImage.getPixelColor(j, i));
                if ((rgba.r + rgba.g + rgba.b) / 3 <= this.config.grayScaleWhiteThreshold) {
                    top = Math.min(i, top);
                    bottom = Math.max(i, bottom);
                    left = Math.min(j, left);
                    right = Math.max(j, right);
                }
            }
        }

        const imageHeight = convertedImageHeight || this.config.imageHeight;
        const imageWidth = convertedImageWidth || this.config.imageWidth;

        sourceImage.crop(left, top, right - left, bottom - top).resize(imageWidth - 2, imageHeight - 2);
        const imageWithWhiteBorder = new Jimp(imageWidth, imageHeight, 'white').blit(sourceImage, 1, 1);

        const data = await imageWithWhiteBorder.getBufferAsync(Jimp.MIME_BMP);
        return new BitMapBuffer(data, this.config.imageHeight, this.config.imageWidth);
    }

    private convertToBitmapGrayImage(type: SKELETONIZEREQUESTIMAGETYPE, buffer: Buffer): Jimp {
        if (type !== SKELETONIZEREQUESTIMAGETYPE.BINARYSTRINGWITHNEWLINE) {
            throw Error('unsupported type ' + type);
        }

        const binaryStringWithNewLine = buffer.toString();
        const binaryMat = binaryStringWithNewLine.split('\n');

        const rows = binaryMat.length;
        const cols = binaryMat[0].length;

        const sourceImage = new Jimp(cols, rows, 'white');
        const hexRedColor = Jimp.rgbaToInt(255, 52, 42, 255);

        for (let i = 0; i < sourceImage.bitmap.height; i++) {
            for (let j = 0; j < sourceImage.bitmap.width; j++) {
                if (binaryMat[i].charAt(j) === '1') {
                    sourceImage.setPixelColor(hexRedColor, j, i);
                }
            }
        }

        return sourceImage;
    }
}
