import { decode } from 'bmp-js';
import { BitMapBuffer } from '../bitMapBuffer';

export async function convertDataToZeroOneMat(bitMapBuffer: BitMapBuffer, grayScaleWhiteThreshold: number): Promise<number[][]> {
    const bmpData = decode(bitMapBuffer.imageBuffer);
    const mat: number[][] = [];

    let index = 0;

    for (let i = 0; i < bmpData.height; i++) {
        const row: number[] = [];
        for (let j = 0; j < bmpData.width; j++) {
            if (i === 0 || i === bmpData.height - 1 || j === 0 || j === bmpData.width - 1) {
                // make sure edges are cleared
                row.push(0);
            } else if (bmpData.data[index + 1] > grayScaleWhiteThreshold) {
                row.push(0);
            } else if (bmpData.data[index + 1] <= grayScaleWhiteThreshold) {
                row.push(1);
            }
            index += 4;
        }

        mat.push(row);
    }

    return mat;
}

export function logMat(mat: Array<number[]>) {
    const row = mat.length;
    let output = '';
    for (let i = 0; i < row; i++) {
        output += mat[i].join('') + '\n';
    }

    console.log(output);
}
