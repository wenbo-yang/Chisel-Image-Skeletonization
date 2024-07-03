import Jimp from 'jimp';
import { BitMapBuffer } from '../bitMapBuffer';
import { SkeletonizationServiceConfig } from '../../config';
import { ISkeletonizationServiceConfig } from '../../types/skeletonizeTypes';
import { IMAGEDATATYPE } from '../../../Chisel-Global-Common-Libraries/src/types/commonTypes';

export class ImageConverter {
    private config: ISkeletonizationServiceConfig;

    constructor(config?: ISkeletonizationServiceConfig) {
        this.config = config || new SkeletonizationServiceConfig();
    }

    public async convertAndResizeToBMP(type: IMAGEDATATYPE, buffer: Buffer, convertedImageHeight?: number, convertedImageWidth?: number, grayScaleWhiteThreshold?: number): Promise<BitMapBuffer> {
        let sourceImage: Jimp;
        if (type === IMAGEDATATYPE.PNG || type === IMAGEDATATYPE.BMP) {
            sourceImage = (await Jimp.read(Buffer.from(buffer))).contrast(1).grayscale();
        } else if (type === IMAGEDATATYPE.BINARYSTRINGWITHNEWLINE) {
            sourceImage = this.convertToBitmapGrayImage(buffer).contrast(1).grayscale();
        } else {
            throw Error('unsupported type: ' + type);
        }

        // get the box
        let top = Number.MAX_VALUE;
        let bottom = Number.MIN_VALUE;
        let right = Number.MIN_VALUE;
        let left = Number.MAX_VALUE;

        const whiteThreshold = grayScaleWhiteThreshold || this.config.grayScaleWhiteThreshold;

        for (let i = 0; i < sourceImage.getHeight(); i++) {
            for (let j = 0; j < sourceImage.getWidth(); j++) {
                const rgba = Jimp.intToRGBA(sourceImage.getPixelColor(j, i));
                if ((rgba.r + rgba.g + rgba.b) / 3 <= whiteThreshold) {
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

    private convertToBitmapGrayImage(buffer: Buffer): Jimp {
        const binaryStringWithNewLine = buffer.toString();
        const binaryMat = binaryStringWithNewLine.split('\n');

        const rows = binaryMat.length;
        const cols = binaryMat[0].length;

        const sourceImage = new Jimp(cols, rows, 'white');
        const hexBlackColor = Jimp.rgbaToInt(1, 1, 1, 255);

        for (let i = 0; i < sourceImage.bitmap.height; i++) {
            for (let j = 0; j < sourceImage.bitmap.width; j++) {
                if (binaryMat[i].charAt(j) === '1') {
                    sourceImage.setPixelColor(hexBlackColor, j, i);
                }
            }
        }

        return sourceImage;
    }
}
