const axios = require('axios');
const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const fs = require('fs/promises');

const axiosClient = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

const url = 'https://localhost:3000';

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
        it('should respond with 200 and response body when correct request body is passed in', async () => {
            const response = await axiosClient.post(skeletifyUrl, {
                name: 'name',
                type: 'type',
                data: Buffer.from('some base64 encoded string').toString('base64'),
            });

            expect(response.status).toEqual(200);
            expect(response.data).toHaveProperty('skeleton');
            expect(response.data).toHaveProperty('strokes');
        });

        it('should respond with 200, after receiving an image', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile (sampleImageUrl, 'binary');
            const arrayBuffer = Buffer.from(data);

            console.log(arrayBuffer.buffer);
            const response = await axiosClient.post(skeletifyUrl, {
                name: 'someImage',
                type: 'png',
                data: arrayBuffer.toString('base64'),
            });

            expect(response.status).toEqual(200);
            expect(response.data).toHaveProperty('skeleton');
            expect(response.data).toHaveProperty('strokes');
        });
    });

});
