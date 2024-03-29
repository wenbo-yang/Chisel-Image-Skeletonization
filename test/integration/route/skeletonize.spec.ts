import { httpsUrl } from '../utils';
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
            const response = await axiosClient.get(httpsUrl + '/healthCheck');

            expect(response.status).toBe(200);
            expect(response.data).toBe('i am healthy!!!');
        });
    });

    describe('POST /skeletonize', () => {
        const skeletonizeUrl = httpsUrl + '/skeletonize';
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
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000111111100000000000000' + '\n' +
                 '0000000000000000001111111100000000000000' + '\n' +
                 '0000000000000000011111111100000000000000' + '\n' +
                 '0000000000000000011111111110000000000000' + '\n' +
                 '0000000000000000011111111110000000000000' + '\n' +
                 '0000000000000000011111111110000000000000' + '\n' +
                 '0000000000000000011111111110000000011100' + '\n' +
                 '0000000000000000001111111100000000011110' + '\n' +
                 '0000000000000000000111111000000000011110' + '\n' +
                 '0000000000000000000111110000000000011110' + '\n' +
                 '0000000000000000000111110000000000011110' + '\n' +
                 '0000000000000000000111100000000000011110' + '\n' +
                 '0000000000000000011111100000000000011110' + '\n' +
                 '0000000001111111111111100000000000111110' + '\n' +
                 '0000000111111111111111110000001111111110' + '\n' +
                 '0000011111111111111111111111111111111100' + '\n' +
                 '0000011111111111111111111111111111111100' + '\n' +
                 '0000111111111111111111111111111111111000' + '\n' +
                 '0000111110000000011111111111111111000000' + '\n' +
                 '0000111100000000011110000000000000000000' + '\n' +
                 '0001111100000000011110000000000000000000' + '\n' +
                 '0001111100000000011110000000000000000000' + '\n' +
                 '0001111000000000011110000000000000000000' + '\n' +
                 '0001111000000000111110000000000000000000' + '\n' +
                 '0000000000000000111110000000000000000000' + '\n' +
                 '0000000000000000111100000000000000000000' + '\n' +
                 '0000000000000000111110000000000000000000' + '\n' +
                 '0000000000000000111110000000000000000000' + '\n' +
                 '0000000000000001111110000000000000000000' + '\n' +
                 '0000000000000001111110000000000000000000' + '\n' +
                 '0000000000000001111110000000000000000000' + '\n' +
                 '0111000000000011111111000000000000000000' + '\n' +
                 '0111100000000011111111111100000000000000' + '\n' +
                 '0111100000000111111111111110000000000000' + '\n' +
                 '0111111111111111110111111111000000000000' + '\n' +
                 '0111111111111111110011111111100000000000' + '\n' +
                 '0111111111111111100000011111110000000000' + '\n' +
                 '0011111111111111100000000111111000000000' + '\n' +
                 '0000111000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000001111000000000' + '\n' +
                 '0000000000000000000000000001111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000001111000000000' + '\n' +
                 '0000000000000000000000000000000000000000' + '\n';

            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
                returnImageHeight: 50,
                returnImageWidth: 40,
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

        it('should receive mat with expected skeleton matrix ', async () => {
            // prettier-ignore
            const expectedSkeleton = 
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000001000000000000000000' + '\n' +
                 '0000000000000000000001000000000000000000' + '\n' +
                 '0000000000000000000001000000000000000000' + '\n' +
                 '0000000000000000000001000000000000000000' + '\n' +
                 '0000000000000000000001000000000000001000' + '\n' +
                 '0000000000000000000010000000000000001000' + '\n' +
                 '0000000000000000000010000000000000001000' + '\n' +
                 '0000000000000000000010000000000000001000' + '\n' +
                 '0000000000000000000010000000000000001000' + '\n' +
                 '0000000000000000000010000000000000001000' + '\n' +
                 '0000000000000000000010000000000000001000' + '\n' +
                 '0000000001111111111100000000000011110000' + '\n' +
                 '0000000110000000001011111111111110000000' + '\n' +
                 '0000001000000000001000000000000000000000' + '\n' +
                 '0000001000000000001000000000000000000000' + '\n' +
                 '0000010000000000001000000000000000000000' + '\n' +
                 '0000010000000000001000000000000000000000' + '\n' +
                 '0000010000000000001000000000000000000000' + '\n' +
                 '0000000000000000001000000000000000000000' + '\n' +
                 '0000000000000000001000000000000000000000' + '\n' +
                 '0000000000000000001000000000000000000000' + '\n' +
                 '0000000000000000001000000000000000000000' + '\n' +
                 '0000000000000000001000000000000000000000' + '\n' +
                 '0000000000000000001000000000000000000000' + '\n' +
                 '0000000000000000001000000000000000000000' + '\n' +
                 '0000000000000000001000000000000000000000' + '\n' +
                 '0000000000000000001000000000000000000000' + '\n' +
                 '0000000000000000010000000000000000000000' + '\n' +
                 '0000000000000000111100000000000000000000' + '\n' +
                 '0010000000000001100011110000000000000000' + '\n' +
                 '0010000000000001000000001000000000000000' + '\n' +
                 '0001111111111110000000000110000000000000' + '\n' +
                 '0000000000000000000000000010000000000000' + '\n' +
                 '0000000000000000000000000001000000000000' + '\n' +
                 '0000000000000000000000000001100000000000' + '\n' +
                 '0000000000000000000000000000100000000000' + '\n' +
                 '0000000000000000000000000000100000000000' + '\n' +
                 '0000000000000000000000000000100000000000' + '\n' +
                 '0000000000000000000000000000100000000000' + '\n' +
                 '0000000000000000000000000000100000000000' + '\n' +
                 '0000000000000000000000000000100000000000' + '\n' +
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000000000000000000000000';

            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
                returnImageHeight: 50,
                returnImageWidth: 40,
            });

            const skeleton = response.data.skeleton;
            expect(response.data.skeleton).toBeDefined();
            expect(skeleton).toEqual(expectedSkeleton);
        });

        it('should generate single perimeter  with expected perimeter matrix ', async () => {
            // prettier-ignore
            const expectedPerimeter = 
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000111111100000000000000' + '\n' +
                 '0000000000000000001100000100000000000000' + '\n' +
                 '0000000000000000011000000100000000000000' + '\n' +
                 '0000000000000000010000000110000000000000' + '\n' +
                 '0000000000000000010000000010000000000000' + '\n' +
                 '0000000000000000010000000010000000000000' + '\n' +
                 '0000000000000000011000000110000000011100' + '\n' +
                 '0000000000000000001100001100000000010110' + '\n' +
                 '0000000000000000000100011000000000010010' + '\n' +
                 '0000000000000000000100010000000000010010' + '\n' +
                 '0000000000000000000100110000000000010010' + '\n' +
                 '0000000000000000000100100000000000010010' + '\n' +
                 '0000000000000000011100100000000000010010' + '\n' +
                 '0000000001111111110000100000000000110010' + '\n' +
                 '0000000111000000000000110000001111100110' + '\n' +
                 '0000011100000000000000011111111000000100' + '\n' +
                 '0000010000000000000000000000000000001100' + '\n' +
                 '0000110011111111110000000000000001111000' + '\n' +
                 '0000100110000000010011111111111111000000' + '\n' +
                 '0000100100000000010010000000000000000000' + '\n' +
                 '0001100100000000010010000000000000000000' + '\n' +
                 '0001001100000000010010000000000000000000' + '\n' +
                 '0001001000000000010010000000000000000000' + '\n' +
                 '0001111000000000110010000000000000000000' + '\n' +
                 '0000000000000000100110000000000000000000' + '\n' +
                 '0000000000000000100100000000000000000000' + '\n' +
                 '0000000000000000100110000000000000000000' + '\n' +
                 '0000000000000000100010000000000000000000' + '\n' +
                 '0000000000000001100010000000000000000000' + '\n' +
                 '0000000000000001000010000000000000000000' + '\n' +
                 '0000000000000001000010000000000000000000' + '\n' +
                 '0111000000000011000011000000000000000000' + '\n' +
                 '0101100000000010000001111100000000000000' + '\n' +
                 '0100100000000110011100000110000000000000' + '\n' +
                 '0100111111111100010110000011000000000000' + '\n' +
                 '0100000000000000110011110001100000000000' + '\n' +
                 '0110000000000000100000011100110000000000' + '\n' +
                 '0011101111111111100000000110011000000000' + '\n' +
                 '0000111000000000000000000010001000000000' + '\n' +
                 '0000000000000000000000000011001000000000' + '\n' +
                 '0000000000000000000000000001001000000000' + '\n' +
                 '0000000000000000000000000001001000000000' + '\n' +
                 '0000000000000000000000000011001000000000' + '\n' +
                 '0000000000000000000000000010001000000000' + '\n' +
                 '0000000000000000000000000010001000000000' + '\n' +
                 '0000000000000000000000000010001000000000' + '\n' +
                 '0000000000000000000000000011001000000000' + '\n' +
                 '0000000000000000000000000001111000000000' + '\n' +
                 '0000000000000000000000000000000000000000';

            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
                returnImageHeight: 50,
                returnImageWidth: 40,
            });

            const strokes = response.data.strokes;

            expect(response.data.skeleton).toBeDefined();
            expect(strokes.length).toEqual(2);
            expect(strokes[0].stroke).toEqual(expectedPerimeter);
            expect(strokes[0].type).toEqual(STROKETYPE.PERIMETER);
        });

        it('should contain a original mat translated into binary string', async () => {
            // prettier-ignore
            const expectedPerimeter = 
                 '0000000000000000000000000000000000000000' + '\n' +
                 '0000000000000000000111111100000000000000' + '\n' +
                 '0000000000000000001111111100000000000000' + '\n' +
                 '0000000000000000011111111100000000000000' + '\n' +
                 '0000000000000000011111111110000000000000' + '\n' +
                 '0000000000000000011111111110000000000000' + '\n' +
                 '0000000000000000011111111110000000000000' + '\n' +
                 '0000000000000000011111111110000000011100' + '\n' +
                 '0000000000000000001111111100000000011110' + '\n' +
                 '0000000000000000000111111000000000011110' + '\n' +
                 '0000000000000000000111110000000000011110' + '\n' +
                 '0000000000000000000111110000000000011110' + '\n' +
                 '0000000000000000000111100000000000011110' + '\n' +
                 '0000000000000000011111100000000000011110' + '\n' +
                 '0000000001111111111111100000000000111110' + '\n' +
                 '0000000111111111111111110000001111111110' + '\n' +
                 '0000011111111111111111111111111111111100' + '\n' +
                 '0000011111111111111111111111111111111100' + '\n' +
                 '0000111111111111111111111111111111111000' + '\n' +
                 '0000111110000000011111111111111111000000' + '\n' +
                 '0000111100000000011110000000000000000000' + '\n' +
                 '0001111100000000011110000000000000000000' + '\n' +
                 '0001111100000000011110000000000000000000' + '\n' +
                 '0001111000000000011110000000000000000000' + '\n' +
                 '0001111000000000111110000000000000000000' + '\n' +
                 '0000000000000000111110000000000000000000' + '\n' +
                 '0000000000000000111100000000000000000000' + '\n' +
                 '0000000000000000111110000000000000000000' + '\n' +
                 '0000000000000000111110000000000000000000' + '\n' +
                 '0000000000000001111110000000000000000000' + '\n' +
                 '0000000000000001111110000000000000000000' + '\n' +
                 '0000000000000001111110000000000000000000' + '\n' +
                 '0111000000000011111111000000000000000000' + '\n' +
                 '0111100000000011111111111100000000000000' + '\n' +
                 '0111100000000111111111111110000000000000' + '\n' +
                 '0111111111111111110111111111000000000000' + '\n' +
                 '0111111111111111110011111111100000000000' + '\n' +
                 '0111111111111111100000011111110000000000' + '\n' +
                 '0011111111111111100000000111111000000000' + '\n' +
                 '0000111000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000001111000000000' + '\n' +
                 '0000000000000000000000000001111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000011111000000000' + '\n' +
                 '0000000000000000000000000001111000000000' + '\n' +
                 '0000000000000000000000000000000000000000';

            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
                returnImageHeight: 50,
                returnImageWidth: 40,
            });

            const strokes = response.data.strokes;

            expect(response.data.skeleton).toBeDefined();
            expect(strokes.length).toEqual(2);
            expect(strokes[1].stroke).toEqual(expectedPerimeter);
            expect(strokes[1].type).toEqual(STROKETYPE.ORIGINAL);
        });

        it('should return image with requested height and width', async () => {
            // prettier-ignore
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
                returnImageHeight: 150,
                returnImageWidth: 120,
            });

            const strokes = response.data.strokes;
            const unzipped = await ungzip(Buffer.from(response.data.grayScale, 'base64'));
            await fs.writeFile('./test/integration/data/running_man_bitmap_upscaled_image_test.bmp', unzipped, { flag: 'w+' });

            expect(response.data.skeleton).toBeDefined();
            expect(strokes.length).toEqual(2);
            expect(response.data.skeleton.split('\n').length).toEqual(150);
            expect(response.data.skeleton.split('\n')[0].length).toEqual(120);
        });
    });
});
