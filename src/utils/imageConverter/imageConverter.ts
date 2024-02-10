import Jimp from 'jimp';
import { BitMapBuffer } from '../bitMapBuffer';
import { Config } from '../../config';

export class ImageConverter {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async convertAndResizeToBMP(buffer: Buffer): Promise<BitMapBuffer> {
        const jimp = await Jimp.read(Buffer.from(buffer));
        const ratio = jimp.getHeight() / jimp.getWidth();

        if ( ratio > 1 ) {
            jimp.resize(Math.floor(this.config.imageWidth/ratio), this.config.imageHeight);
        }
        else {
            jimp.resize(this.config.imageWidth, Math.floor(this.config.imageHeight * ratio));
        }
            
        const data = await jimp.grayscale().getBufferAsync(Jimp.MIME_BMP);

        return new BitMapBuffer(data, this.config.imageHeight, this.config.imageWidth);
    }
}
