import { url } from '../utils';
import axios from 'axios';
import https from 'https';
import fs from 'fs/promises';
import { SkeletifyResponse } from '../../../src/types/skeletifyTypes'
import { ungzip } from 'node-gzip';

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

            const unzipped = await ungzip(Buffer.from(response.data.skeleton, 'base64'));
            await fs.writeFile('./test/integration/data/running_man_bitmap_test.bmp', unzipped, { flag: 'w+' })
            expect(response.data.skeleton).toBeDefined();
        });
    });
});
