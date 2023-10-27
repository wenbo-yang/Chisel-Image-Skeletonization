import { url } from '../utils';
import axios from 'axios';
import https from 'https';
import fs from 'fs/promises';
import Jimp from 'jimp';

const axiosClient = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

describe('skeletify request', () => {
    xdescribe('try ', () => {
        it('test', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data);

            const jimp = await Jimp.read(arrayBuffer);
            const test = await jimp.getBufferAsync(Jimp.MIME_BMP);

            console.log(arrayBuffer);
            console.log(test);
        });
    });

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

            console.log(arrayBuffer);

            const response = await axiosClient.post(skeletifyUrl, {
                name: 'someImage',
                type: 'png',
                data: arrayBuffer,
            });

            expect(response.status).toEqual(200);
            expect(response.data).toHaveProperty('skeleton');
            expect(response.data).toHaveProperty('strokes');
        });
    });
});
