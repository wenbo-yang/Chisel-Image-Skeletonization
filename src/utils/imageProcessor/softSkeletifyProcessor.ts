import { Config } from '../../config';
import { BitMapBuffer } from '../bitMapBuffer';
import { decode } from 'bmp-js';
import { SkeletifyProcessor } from '../../types/skeletifyTypes';
import { zsThinning } from './zsSoftThinning';

export class SoftSkeletifyProcessor implements SkeletifyProcessor {
    private config: Config;

    constructor(config?: Config) {
        this.config = config || new Config();
    }

    public async thinning(bitMapBuffer: BitMapBuffer): Promise<Array<number[]>> {
        const mat = await this.convertDataToZeroOneMat(bitMapBuffer);
        await zsThinning(mat);
        // logMat(mat);
        return mat;
    }

    private async convertDataToZeroOneMat(bitMapBuffer: BitMapBuffer): Promise<number[][]> {
        const bmpData = decode(bitMapBuffer.imageBuffer);
        const mat: number[][] = [];

        let index = 0;

        for (let i = 0; i < bmpData.height; i++) {
            const row: number[] = [];
            for (let j = 0; j < bmpData.width; j++) {
                if (i === 0 || i === bmpData.height - 1 || j === 0 || j === bmpData.width - 1) {
                    // make sure edges are cleared
                    row.push(0);
                } else if (bmpData.data[index + 1] > this.config.grayScaleWhiteThreshold) {
                    row.push(0);
                } else if (bmpData.data[index + 1] <= this.config.grayScaleWhiteThreshold) {
                    row.push(1);
                }
                index += 4;
            }

            mat.push(row);
        }

        return mat;
    }
}
