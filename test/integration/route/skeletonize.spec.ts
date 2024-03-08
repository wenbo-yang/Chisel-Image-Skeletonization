import { url } from '../utils';
import axios from 'axios';
import https from 'https';
import fs from 'fs/promises';
import { SkeletonizeResponse } from '../../../src/types/skeletonizeTypes';
import { ungzip } from 'node-gzip';
import { decode } from 'bmp-js';
import { Config } from '../../../src/config';
import { STROKETYPE } from '../../../src/types/skeletonizeTypes';

const axiosClient = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

describe('skeletonize request', () => {
    describe('GET /healthCheck', () => {
        it('should respond with 200', async () => {
            const response = await axiosClient.get(url + '/healthCheck');

            expect(response.status).toBe(200);
            expect(response.data).toBe('i am healthy!!!');
        });
    });

    describe('POST /skeletonize', () => {
        const skeletonizeUrl = url + '/skeletonize';
        it('should respond with 200, after receiving an image', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data);

            const response = await axiosClient.post(skeletonizeUrl, {
                name: 'someImage',
                type: 'png',
                data: arrayBuffer,
            });

            expect(response.status).toEqual(200);
            expect(response.data.compression).toEqual('gzip');
            expect(response.data).toHaveProperty('skeleton');
            expect(response.data).toHaveProperty('grayScale');
            expect(response.data).toHaveProperty('strokes');
        });

        it('should respond with 200 and response with image buffer data ', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
            });

            const unzipped = await ungzip(Buffer.from(response.data.grayScale, 'base64'));
            await fs.writeFile('./test/integration/data/running_man_bitmap_test.bmp', unzipped, { flag: 'w+' });
            expect(response.data.grayScale).toBeDefined();
        });

        it('should convert running man image with expected array list', async () => {
            // prettier-ignore
            const expectedImage = 
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000001111100000000000000000' + '\n' +
            '000000000000000000111111100000000000000000' + '\n' +
            '000000000000000000111111110000000000000000' + '\n' +
            '000000000000000001111111110000000000000000' + '\n' +
            '000000000000000001111111110000000000000000' + '\n' +
            '000000000000000001111111110000000111000000' + '\n' +
            '000000000000000000111111100000001111000000' + '\n' +
            '000000000000000000001111000000001111000000' + '\n' +
            '000000000000000000011110000000000111100000' + '\n' +
            '000000000000000000011110000000000111100000' + '\n' +
            '000000000000000001111110000000000111100000' + '\n' +
            '000000000011111111111110000000111111000000' + '\n' +
            '000000001111111111111111111111111111000000' + '\n' +
            '000000011111111111111111111111111110000000' + '\n' +
            '000000011111100000111111111111111100000000' + '\n' +
            '000000111110000000111001111111000000000000' + '\n' +
            '000000111100000001111000000000000000000000' + '\n' +
            '000000111100000001111000000000000000000000' + '\n' +
            '000000111100000001111000000000000000000000' + '\n' +
            '000000111000000001111000000000000000000000' + '\n' +
            '000000000000000001111000000000000000000000' + '\n' +
            '000000000000000001111000000000000000000000' + '\n' +
            '000000000000000011111000000000000000000000' + '\n' +
            '000000000000000011111000000000000000000000' + '\n' +
            '000000000000000111111100000000000000000000' + '\n' +
            '000011100000000111111111000000000000000000' + '\n' +
            '000011110000000111111111110000000000000000' + '\n' +
            '000011111111111111011111111000000000000000' + '\n' +
            '000011111111111111001111111100000000000000' + '\n' +
            '000011111111111111000001111110000000000000' + '\n' +
            '000001111111111110000000111110000000000000' + '\n' +
            '000000000000000000000000011110000000000000' + '\n' +
            '000000000000000000000000001110000000000000' + '\n' +
            '000000000000000000000000011110000000000000' + '\n' +
            '000000000000000000000000011110000000000000' + '\n' +
            '000000000000000000000000011110000000000000' + '\n' +
            '000000000000000000000000011111000000000000' + '\n' +
            '000000000000000000000000001111000000000000' + '\n' +
            '000000000000000000000000000110000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n';

            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
            });

            const unzipped = await ungzip(Buffer.from(response.data.grayScale, 'base64'));
            const bmpData = decode(unzipped);

            let index = 0;
            let output = '';

            for (let i = 0; i < bmpData.height; i++) {
                const row: number[] = [];
                for (let j = 0; j < bmpData.width; j++) {
                    if (i === 0 || i === bmpData.height - 1 || j === 0 || j === bmpData.width - 1) {
                        row.push(0);
                    } else if (bmpData.data[index + 1] > new Config().grayScaleWhiteThreshold) {
                        row.push(0);
                    } else if (bmpData.data[index + 1] <= new Config().grayScaleWhiteThreshold) {
                        row.push(1);
                    }

                    index += 4;
                }

                output = output + row.join('') + '\n';
            }

            expect(output).toEqual(expectedImage);
        });

        it('test123 should receive mat with expected skeleton matrix ', async () => {
            // prettier-ignore
            const expectedSkeleton = 
                '00000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000' + '\n' +
                '00000000000000000100000000000000000' + '\n' +
                '00000000000000000100000000000000000' + '\n' +
                '00000000000000000100000000000000000' + '\n' +
                '00000000000000000100000000000010000' + '\n' +
                '00000000000000000100000000000010000' + '\n' +
                '00000000000000000100000000000010000' + '\n' +
                '00000000000000000100000000000010000' + '\n' +
                '00000000000000001000000000000010000' + '\n' +
                '00000000000000001000000000000110000' + '\n' +
                '00000001111111111000000000001100000' + '\n' +
                '00000111000000010111111111110000000' + '\n' +
                '00001100000000010000000000000000000' + '\n' +
                '00001000000000010000000000000000000' + '\n' +
                '00001000000000010000000000000000000' + '\n' +
                '00010000000000010000000000000000000' + '\n' +
                '00000000000000100000000000000000000' + '\n' +
                '00000000000000100000000000000000000' + '\n' +
                '00000000000000100000000000000000000' + '\n' +
                '00000000000000100000000000000000000' + '\n' +
                '00000000000000100000000000000000000' + '\n' +
                '00000000000000100000000000000000000' + '\n' +
                '00000000000000100000000000000000000' + '\n' +
                '00000000000001110000000000000000000' + '\n' +
                '00000000000010001100000000000000000' + '\n' +
                '00000000000010000011100000000000000' + '\n' +
                '00111111111100000000110000000000000' + '\n' +
                '00000000000000000000011000000000000' + '\n' +
                '00000000000000000000001000000000000' + '\n' +
                '00000000000000000000000100000000000' + '\n' +
                '00000000000000000000000100000000000' + '\n' +
                '00000000000000000000000100000000000' + '\n' +
                '00000000000000000000000100000000000' + '\n' +
                '00000000000000000000000100000000000' + '\n' +
                '00000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000'

            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
            });

            const skeleton = response.data.skeleton;
            expect(response.data.skeleton).toBeDefined();
            expect(skeleton).toEqual(expectedSkeleton);
        });

        it('should generate single perimeter  with expected perimeter matrix ', async () => {
            // prettier-ignore
            const expectedPerimeter = 
                '0000000000000000000000000000000000' + '\n' +
                '0000000000000011111110000000000000' + '\n' +
                '0000000000000010000011000000000000' + '\n' +
                '0000000000000110000001000000000000' + '\n' +
                '0000000000000100000001000000000000' + '\n' +
                '0000000000000110000011000000011100' + '\n' +
                '0000000000000011100110000000110100' + '\n' +
                '0000000000000000101100000000110100' + '\n' +
                '0000000000000001101000000000010110' + '\n' +
                '0000000000000001001000000000010010' + '\n' +
                '0000000000000111001000000000010110' + '\n' +
                '0000001111111100001000000011110100' + '\n' +
                '0000111000000000001111111110001100' + '\n' +
                '0001100011111110000000000000011000' + '\n' +
                '0001001110000010111100000111110000' + '\n' +
                '0011011000000010100111111100000000' + '\n' +
                '0010010000000110100000000000000000' + '\n' +
                '0010010000000100100000000000000000' + '\n' +
                '0010110000000100100000000000000000' + '\n' +
                '0011100000000100100000000000000000' + '\n' +
                '0000000000000100100000000000000000' + '\n' +
                '0000000000000100100000000000000000' + '\n' +
                '0000000000001100100000000000000000' + '\n' +
                '0000000000001000100000000000000000' + '\n' +
                '0000000000011000110000000000000000' + '\n' +
                '0110000000010000011100000000000000' + '\n' +
                '0111000000010111000111000000000000' + '\n' +
                '0101111111110101100001100000000000' + '\n' +
                '0100000000000100111100110000000000' + '\n' +
                '0100000000001100000110011000000000' + '\n' +
                '0111111111111000000011001000000000' + '\n' +
                '0000000000000000000001101000000000' + '\n' +
                '0000000000000000000000101000000000' + '\n' +
                '0000000000000000000001101000000000' + '\n' +
                '0000000000000000000001001000000000' + '\n' +
                '0000000000000000000001001000000000' + '\n' +
                '0000000000000000000001101100000000' + '\n' +
                '0000000000000000000000111100000000' + '\n' +
                '0000000000000000000000011000000000' + '\n' +
                '0000000000000000000000000000000000'

            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
            });

            const strokes = response.data.strokes;

            expect(response.data.skeleton).toBeDefined();
            expect(strokes.length).toEqual(1);
            expect(strokes[0].stroke).toEqual(expectedPerimeter);
            expect(strokes[0].type).toEqual(STROKETYPE.PERIMETER);
        });
    });
});