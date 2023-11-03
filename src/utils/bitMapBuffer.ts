export enum ImageType {
    JPG = 'jpg',
    PNG = 'png',
    BMP = 'bmp',
}

export class BitMapBuffer {
    private buffer: string;

    constructor(buffer: Buffer) {
        this.buffer = Buffer.from(buffer).toString('base64');
    }

    get imageType(): string {
        return ImageType.BMP;
    }

    get imageBuffer(): string {
        return this.buffer;
    }
}
