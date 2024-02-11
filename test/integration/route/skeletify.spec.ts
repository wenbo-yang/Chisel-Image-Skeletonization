import { url } from '../utils';
import axios from 'axios';
import https from 'https';
import fs from 'fs/promises';
import { SkeletifyResponse } from '../../../src/types/skeletifyTypes';
import { ungzip } from 'node-gzip';
import { decode } from "bmp-js";
import { Config } from '../../../src/config';
import { unzip } from 'zlib';

const axiosClient = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

describe('skeletify request', () => {
    describe('GET /healthCheck', () => {
        it('should respond with 200', async () => {
            const response = await axiosClient.get(url + '/healthCheck');

            expect(response.status).toBe(200);
            expect(response.data).toBe('i am healthy!!!');
        });
    });

    describe('POST /skeletify', () => {
        const skeletifyUrl = url + '/skeletify';
        it('should respond with 200, after receiving an image', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data);

            const response = await axiosClient.post(skeletifyUrl, {
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

            const response = await axiosClient.post<SkeletifyResponse>(skeletifyUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
            });

            const unzipped = await ungzip(Buffer.from(response.data.grayScale, 'base64'));
            await fs.writeFile('./test/integration/data/running_man_bitmap_test.bmp', unzipped, { flag: 'w+' });
            expect(response.data.grayScale).toBeDefined();
        });

        it('should convert running man image expected array list', async() => {
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
            '000000000000000000000000000000000000000000' + '\n'

            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletifyResponse>(skeletifyUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
            });

            const unzipped = await ungzip(Buffer.from(response.data.grayScale, 'base64'));
            
            const bmpData = decode(unzipped);

            let index = 0;
            let output = '';

            for(let i = 0; i < bmpData.height; i++) {
                const row: number[] = [];
                for (let j = 0; j < bmpData.width; j++) {
                    
                    if (i === 0 || i === bmpData.height - 1 || j === 0 || j === bmpData.width - 1) {
                        row.push(0);
                    } 
                    else if (bmpData.data[index + 1] > new Config().grayScaleWhiteThreshold) { 
                        row.push(0); 
                    } 
                    else if (bmpData.data[index + 1] <= new Config().grayScaleWhiteThreshold) {
                        row.push(1);
                    } 

                    index += 4;
                }

                output = (output + row.join('') + '\n');
            }
            
            expect(output).toEqual(expectedImage);
        });

        it('should receive mat with expected skeleton matrix ', async () => {
            const expectedSkeleton = 
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000100000000000000000000' + '\n' +
            '000000000000000000000100000000000000000000' + '\n' +
            '000000000000000000000100000000000000000000' + '\n' +
            '000000000000000000000100000000000010000000' + '\n' +
            '000000000000000000000100000000000010000000' + '\n' +
            '000000000000000000000100000000000010000000' + '\n' +
            '000000000000000000000100000000000010000000' + '\n' +
            '000000000000000000001000000000000010000000' + '\n' +
            '000000000000000000001000000000000110000000' + '\n' +
            '000000000001111111111000000000001100000000' + '\n' +
            '000000000111000000010111111111110000000000' + '\n' +
            '000000001100000000010000000000000000000000' + '\n' +
            '000000001000000000010000000000000000000000' + '\n' +
            '000000001000000000010000000000000000000000' + '\n' +
            '000000010000000000010000000000000000000000' + '\n' +
            '000000000000000000100000000000000000000000' + '\n' +
            '000000000000000000100000000000000000000000' + '\n' +
            '000000000000000000100000000000000000000000' + '\n' +
            '000000000000000000100000000000000000000000' + '\n' +
            '000000000000000000100000000000000000000000' + '\n' +
            '000000000000000000100000000000000000000000' + '\n' +
            '000000000000000000100000000000000000000000' + '\n' +
            '000000000000000001110000000000000000000000' + '\n' +
            '000000000000000010001100000000000000000000' + '\n' +
            '000001000000000010000011100000000000000000' + '\n' +
            '000000111111111100000000110000000000000000' + '\n' +
            '000000000000000000000000011000000000000000' + '\n' +
            '000000000000000000000000001000000000000000' + '\n' +
            '000000000000000000000000000100000000000000' + '\n' +
            '000000000000000000000000000100000000000000' + '\n' +
            '000000000000000000000000000100000000000000' + '\n' +
            '000000000000000000000000000100000000000000' + '\n' +
            '000000000000000000000000000100000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n' +
            '000000000000000000000000000000000000000000' + '\n';

            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletifyResponse>(skeletifyUrl, {
                name: 'someImage',
                type: 'png',
                compression: 'gzip',
                data: arrayBuffer,
            });

            const skeleton = response.data.skeleton;
            let output = '';
            for (let i = 0; i < skeleton.length; i++) {
                output += skeleton[i].join("") + '\n';
            }

            expect(response.data.skeleton).toBeDefined();
            expect(output).toEqual(expectedSkeleton);
        });
    });
});
