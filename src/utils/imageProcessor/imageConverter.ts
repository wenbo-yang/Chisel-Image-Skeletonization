import Jimp from 'jimp';
import { BitMapBuffer } from '../bitMapBuffer';

export class ImageConverter {
    public async convertToBMP(buffer: Buffer): Promise<BitMapBuffer> {
        const jimp = await Jimp.read(Buffer.from(buffer));
        const data = await jimp.getBufferAsync(Jimp.MIME_BMP);

        return new BitMapBuffer(data);
    }
}
