import { SkeletifiedImage } from '../types/skeletifyTypes';
import { BitMapBuffer } from '../utils/bitMapBuffer';

export class SkeletifyModel {
    public async trySkeletify(type: string, data: Buffer): Promise<SkeletifiedImage> {
        // stubby
        return {
            skeleton: new BitMapBuffer(data),
            strokes: [new BitMapBuffer(data)],
        };
    }
}
