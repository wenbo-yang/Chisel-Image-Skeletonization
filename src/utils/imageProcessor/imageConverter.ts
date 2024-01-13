import Jimp from 'jimp';
import { BitMapBuffer } from '../bitMapBuffer';
import { Config } from '../../config';

export class ImageConverter {
    private config: Config;
    
    constructor(config?: Config) {
        this.config = config || new Config()
    }

    public async convertToBMP(buffer: Buffer): Promise<BitMapBuffer> {
        const jimp = await Jimp.read(Buffer.from(buffer));
        jimp.resize(this.config.imageHeight, this.config.imageWidth)
        const data = await jimp.getBufferAsync(Jimp.MIME_BMP);

        return new BitMapBuffer(data);
    }
}
