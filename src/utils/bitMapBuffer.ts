export enum ImageType {
    JPG = 'jpg',
    PNG = 'png',
    BMP = 'bmp',
}

export class BitMapBuffer {
    private buffer: Buffer;

    constructor(buffer: Buffer) {
        this.buffer = buffer;
    }

    get imageType(): string {
        return ImageType.BMP;
    }

    get imageBuffer(): Buffer {
        return this.buffer;
    }
}
