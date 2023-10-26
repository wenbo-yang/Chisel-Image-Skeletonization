export enum ImageType {
    JPG = 'jpg',
    PNG = 'png',
    BMP = 'bmp',
}

export class BitMapBuffer extends Buffer {
    get imageType() {
        return ImageType.BMP;
    }
}
