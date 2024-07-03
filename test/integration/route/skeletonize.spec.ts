import { httpsUrl } from '../utils';
import axios from 'axios';
import https from 'https';
import fs from 'fs/promises';
import { SkeletonizeResponse, Transformed } from '../../../src/types/skeletonizeTypes';
import { gzip, ungzip } from 'node-gzip';
import { decode } from 'bmp-js';
import { SkeletonizationServiceConfig } from '../../../src/config';
import { TRANSFORMEDTYPE } from '../../../src/types/skeletonizeTypes';
import Jimp from 'jimp';
import { COMPRESSIONTYPE, IMAGEDATATYPE } from '../../../Chisel-Global-Common-Libraries/src/types/commonTypes';

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
                type: IMAGEDATATYPE.PNG,
                data: arrayBuffer,
                returnCompression: COMPRESSIONTYPE.GZIP,
            });

            expect(response.status).toEqual(200);
            expect(response.data.compression).toEqual(COMPRESSIONTYPE.GZIP);
            expect(response.data).toHaveProperty('transformedData');
        });

        it('should respond with 200 and response with image buffer data compressed', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(await gzip(data)).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: IMAGEDATATYPE.PNG,
                compression: COMPRESSIONTYPE.GZIP,
                data: arrayBuffer,
                returnCompression: COMPRESSIONTYPE.GZIP,
            });

            expect(response.data.compression).toEqual(COMPRESSIONTYPE.GZIP);

            const original = response.data.transformedData.find((s: Transformed) => s.type === TRANSFORMEDTYPE.ORIGINAL);
            const uncompressedData = await ungzip(Buffer.from(original?.strokeImage || '', 'base64'));
            expect(uncompressedData).toBeDefined();
            (await Jimp.read(uncompressedData)).writeAsync('./test/integration/data/running_man_original_processed_test.png');
            const outputOriginal = await fs.readFile(sampleImageUrl);
            expect(outputOriginal).toBeDefined();
        });

        it('should respond with 200 and response with plain buffer data ', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: IMAGEDATATYPE.PNG,
                compression: COMPRESSIONTYPE.PLAIN,
                data: arrayBuffer,
                returnCompression: COMPRESSIONTYPE.GZIP,
            });

            expect(response.data.transformedData).toBeDefined();
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
            '0000000000000000011111111110000000001100' + '\n' +
            '0000000000000000001111111100000000011110' + '\n' +
            '0000000000000000000111111000000000011110' + '\n' +
            '0000000000000000000111110000000000011110' + '\n' +
            '0000000000000000000111110000000000011110' + '\n' +
            '0000000000000000000111100000000000011110' + '\n' +
            '0000000000000000011111100000000000011110' + '\n' +
            '0000000001111111111111100000000000111110' + '\n' +
            '0000000111111111111111110000001111111110' + '\n' +
            '0000001111111111111111111111111111111110' + '\n' +
            '0000011111111111111111111111111111111100' + '\n' +
            '0000111111111111111111111111111111111000' + '\n' +
            '0000111110000000011111111111111111000000' + '\n' +
            '0000111100000000011110000000000000000000' + '\n' +
            '0001111100000000011110000000000000000000' + '\n' +
            '0001111100000000011110000000000000000000' + '\n' +
            '0001111000000000011110000000000000000000' + '\n' +
            '0001111000000000111110000000000000000000' + '\n' +
            '0000010000000000111110000000000000000000' + '\n' +
            '0000000000000000111110000000000000000000' + '\n' +
            '0000000000000000111110000000000000000000' + '\n' +
            '0000000000000000111110000000000000000000' + '\n' +
            '0000000000000001111111000000000000000000' + '\n' +
            '0000000000000001111111000000000000000000' + '\n' +
            '0000000000000001111111000000000000000000' + '\n' +
            '0111000000000011111111000000000000000000' + '\n' +
            '0111100000000011111111111100000000000000' + '\n' +
            '0111100000000011111111111110000000000000' + '\n' +
            '0111111111111111110111111111000000000000' + '\n' +
            '0111111111111111110011111111100000000000' + '\n' +
            '0111111111111111100000011111110000000000' + '\n' +
            '0011111111111111100000000111111000000000' + '\n' +
            '0001111111000000000000000011111000000000' + '\n' +
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
                type: IMAGEDATATYPE.PNG,
                compression: COMPRESSIONTYPE.PLAIN,
                data: arrayBuffer,
                returnCompression: COMPRESSIONTYPE.PLAIN,
                returnImageHeight: 50,
                returnImageWidth: 40,
            });

            expect(response.data.transformedData.find((s: Transformed )=> s.type === TRANSFORMEDTYPE.ORIGINAL)?.stroke).toEqual(expectedImage);
        });

        it('should receive mat with expected skeleton matrix', async () => {
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
            '0000000000000000000001000000000000000000' + '\n' +
            '0000000000000000000010000000000000001000' + '\n' +
            '0000000000000000000010000000000000001000' + '\n' +
            '0000000000000000000010000000000000001000' + '\n' +
            '0000000000000000000010000000000000001000' + '\n' +
            '0000000000000000000010000000000000001000' + '\n' +
            '0000000000000000000010000000000000001000' + '\n' +
            '0000000001111111111100000000000011110000' + '\n' +
            '0000000110000000001011111111111110000000' + '\n' +
            '0000001100000000001000000000000000000000' + '\n' +
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
            '0000000000000000011000000000000000000000' + '\n' +
            '0000000000000000110100000000000000000000' + '\n' +
            '0010000000000001100011110000000000000000' + '\n' +
            '0010000000000001000000001000000000000000' + '\n' +
            '0001100011111110000000000110000000000000' + '\n' +
            '0000011100000000000000000010000000000000' + '\n' +
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
                type: IMAGEDATATYPE.PNG,
                compression: COMPRESSIONTYPE.PLAIN,
                data: arrayBuffer,
                returnCompression: COMPRESSIONTYPE.GZIP,
                returnImageHeight: 50,
                returnImageWidth: 40,
            });

            const skeleton = response.data.transformedData[2].stroke;

            expect(response.data.transformedData[2]).toBeDefined();
            expect(response.data.transformedData[2].type).toEqual(TRANSFORMEDTYPE.SKELETON);
            expect((await ungzip(Buffer.from(skeleton, 'base64'))).toString()).toEqual(expectedSkeleton);
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
            '0000000000000000011000000110000000001100' + '\n' +
            '0000000000000000001100001100000000011110' + '\n' +
            '0000000000000000000100011000000000010010' + '\n' +
            '0000000000000000000100010000000000010010' + '\n' +
            '0000000000000000000100110000000000010010' + '\n' +
            '0000000000000000000100100000000000010010' + '\n' +
            '0000000000000000011100100000000000010010' + '\n' +
            '0000000001111111110000100000000000110010' + '\n' +
            '0000000111000000000000110000001111100010' + '\n' +
            '0000001100000000000000011111111000000110' + '\n' +
            '0000011000000000000000000000000000001100' + '\n' +
            '0000110011111111110000000000000001111000' + '\n' +
            '0000100110000000010011111111111111000000' + '\n' +
            '0000100100000000010010000000000000000000' + '\n' +
            '0001100100000000010010000000000000000000' + '\n' +
            '0001001100000000010010000000000000000000' + '\n' +
            '0001001000000000010010000000000000000000' + '\n' +
            '0001111000000000110010000000000000000000' + '\n' +
            '0000010000000000100010000000000000000000' + '\n' +
            '0000000000000000100010000000000000000000' + '\n' +
            '0000000000000000100010000000000000000000' + '\n' +
            '0000000000000000100010000000000000000000' + '\n' +
            '0000000000000001100011000000000000000000' + '\n' +
            '0000000000000001000001000000000000000000' + '\n' +
            '0000000000000001000001000000000000000000' + '\n' +
            '0111000000000011000001000000000000000000' + '\n' +
            '0101100000000010000001111100000000000000' + '\n' +
            '0100100000000010011100000110000000000000' + '\n' +
            '0100111111111110010110000011000000000000' + '\n' +
            '0100000000000000110011110001100000000000' + '\n' +
            '0110000000000000100000011100110000000000' + '\n' +
            '0011000001111111100000000110011000000000' + '\n' +
            '0001111111000000000000000010001000000000' + '\n' +
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
                type: IMAGEDATATYPE.PNG,
                compression: COMPRESSIONTYPE.PLAIN,
                data: arrayBuffer,
                returnCompression: COMPRESSIONTYPE.PLAIN,
                returnImageHeight: 50,
                returnImageWidth: 40,
            });

            const strokes = response.data.transformedData;

            expect(response.data.transformedData[2]).toBeDefined();
            expect(strokes.length).toEqual(3);
            expect(strokes[0].stroke).toEqual(expectedPerimeter);
            expect(strokes[0].type).toEqual(TRANSFORMEDTYPE.PERIMETER);
        });

        it('should return image with requested height and width', async () => {
            // prettier-ignore
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: IMAGEDATATYPE.PNG,
                compression: COMPRESSIONTYPE.PLAIN,
                data: arrayBuffer,
                returnCompression: COMPRESSIONTYPE.PLAIN,
                returnImageHeight: 150,
                returnImageWidth: 120,
            });

            const strokes = response.data.transformedData;
            
            expect(response.data.transformedData[2]).toBeDefined();
            expect(strokes.length).toEqual(3);
            expect(response.data.transformedData[2].stroke.split('\n').length).toEqual(150);
            expect(response.data.transformedData[2].stroke.split('\n')[0].length).toEqual(120);
        });

        it('test123 should respond with 200, after sending binary with new line breaks', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const grayscaleWhiteThreshold = new SkeletonizationServiceConfig().grayScaleWhiteThreshold;
            const sourceImage = (await Jimp.read(data)).grayscale();
            const binaryMat = new Array<string>(sourceImage.getHeight()).map((s) => (s = ''));

            for (let i = 0; i < sourceImage.getHeight(); i++) {
                for (let j = 0; j < sourceImage.getWidth(); j++) {
                    const rgba = Jimp.intToRGBA(sourceImage.getPixelColor(j, i));
                    if ((rgba.r + rgba.g + rgba.b) / 3 <= grayscaleWhiteThreshold) {
                        binaryMat[i] = binaryMat[i] === undefined ? '1' : binaryMat[i] + '1';
                    } else {
                        binaryMat[i] = binaryMat[i] === undefined ? '0' : binaryMat[i] + '0';
                    }
                }
            }

            const binaryStringWithNewLine = binaryMat.join('\n');

            const response = await axiosClient.post(skeletonizeUrl, {
                name: 'someImage',
                type: IMAGEDATATYPE.BINARYSTRINGWITHNEWLINE,
                compression: COMPRESSIONTYPE.PLAIN,
                data: Buffer.from(binaryStringWithNewLine).toString('base64'),
                returnCompression: COMPRESSIONTYPE.GZIP,
            });

            expect(response.status).toEqual(200);
            expect(response.data.compression).toEqual(COMPRESSIONTYPE.GZIP);
            expect(response.data).toHaveProperty('transformedData');

            const unzipped = await ungzip(Buffer.from(response.data.transformedData.find((s: Transformed) => s.type === TRANSFORMEDTYPE.ORIGINAL)?.strokeImage || '', 'base64'));
            await fs.writeFile('./test/integration/data/running_man_default_size_test.png', unzipped, { flag: 'w+' });
            await fs.writeFile('./test/integration/data/output_for_character_training_test.json', JSON.stringify(response.data), { flag: 'w+' });

            expect(await fs.readFile('./test/integration/data/output_for_character_training_test.json')).toBeDefined();
        });

        it('should respond with 200, after sending compressed binary with new line breaks', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const grayscaleWhiteThreshold = new SkeletonizationServiceConfig().grayScaleWhiteThreshold;
            const sourceImage = (await Jimp.read(data)).grayscale();
            const binaryMat = new Array<string>(sourceImage.getHeight()).map((s) => (s = ''));

            for (let i = 0; i < sourceImage.getHeight(); i++) {
                for (let j = 0; j < sourceImage.getWidth(); j++) {
                    const rgba = Jimp.intToRGBA(sourceImage.getPixelColor(j, i));
                    if ((rgba.r + rgba.g + rgba.b) / 3 <= grayscaleWhiteThreshold) {
                        binaryMat[i] = binaryMat[i] === undefined ? '1' : binaryMat[i] + '1';
                    } else {
                        binaryMat[i] = binaryMat[i] === undefined ? '0' : binaryMat[i] + '0';
                    }
                }
            }

            const binaryStringWithNewLine = binaryMat.join('\n');

            const response = await axiosClient.post(skeletonizeUrl, {
                name: 'someImage',
                type: IMAGEDATATYPE.BINARYSTRINGWITHNEWLINE,
                compression: COMPRESSIONTYPE.GZIP,
                data: (await gzip(binaryStringWithNewLine)).toString('base64'),
                returnCompression: COMPRESSIONTYPE.GZIP,
            });

            expect(response.status).toEqual(200);
            expect(response.data.compression).toEqual(COMPRESSIONTYPE.GZIP);
            expect(response.data).toHaveProperty('transformedData');

            const unzipped = await ungzip(Buffer.from(response.data.transformedData.find((s: Transformed) => s.type === TRANSFORMEDTYPE.ORIGINAL)?.strokeImage || '', 'base64'));
            await fs.writeFile('./test/integration/data/running_man_default_size_test.png', unzipped, { flag: 'w+' });
            await fs.writeFile('./test/integration/data/output_for_character_training_test.json', JSON.stringify(response.data), { flag: 'w+' });

            expect(await fs.readFile('./test/integration/data/output_for_character_training_test.json')).toBeDefined();
        });

        it('should respond with 200, after sending binary with new line breaks', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const grayscaleWhiteThreshold = new SkeletonizationServiceConfig().grayScaleWhiteThreshold;
            const sourceImage = (await Jimp.read(data)).grayscale();
            const binaryMat = new Array<string>(sourceImage.getHeight()).map((s) => (s = ''));

            for (let i = 0; i < sourceImage.getHeight(); i++) {
                for (let j = 0; j < sourceImage.getWidth(); j++) {
                    const rgba = Jimp.intToRGBA(sourceImage.getPixelColor(j, i));
                    if ((rgba.r + rgba.g + rgba.b) / 3 <= grayscaleWhiteThreshold) {
                        binaryMat[i] = binaryMat[i] === undefined ? '1' : binaryMat[i] + '1';
                    } else {
                        binaryMat[i] = binaryMat[i] === undefined ? '0' : binaryMat[i] + '0';
                    }
                }
            }

            const binaryStringWithNewLine = binaryMat.join('\n');

            const response = await axiosClient.post(skeletonizeUrl, {
                name: 'someImage',
                type: IMAGEDATATYPE.BINARYSTRINGWITHNEWLINE,
                compression: COMPRESSIONTYPE.PLAIN,
                data: Buffer.from(binaryStringWithNewLine).toString('base64'),
                returnCompression: COMPRESSIONTYPE.GZIP,
            });

            expect(response.status).toEqual(200);
            expect(response.data.compression).toEqual(COMPRESSIONTYPE.GZIP);
            expect(response.data).toHaveProperty('transformedData');

            const unzipped = await ungzip(Buffer.from(response.data.transformedData.find((s: Transformed) => s.type === TRANSFORMEDTYPE.ORIGINAL)?.strokeImage || '', 'base64'));
            await fs.writeFile('./test/integration/data/running_man_default_size_test.png', unzipped, { flag: 'w+' });
            await fs.writeFile('./test/integration/data/output_for_character_training_test.json', JSON.stringify(response.data), { flag: 'w+' });

            expect(await fs.readFile('./test/integration/data/output_for_character_training_test.json')).toBeDefined();
        });

        it('should return test character with requested height and width, when passing in custom grayscalethreshold', async () => {
            // prettier-ignore
            const sampleImageUrl = './test/integration/data/zou_character.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'someImage',
                type: IMAGEDATATYPE.PNG,
                compression: COMPRESSIONTYPE.PLAIN,
                data: arrayBuffer,
                grayScaleWhiteThreshold: 100,
                returnCompression: COMPRESSIONTYPE.PLAIN,
                returnImageHeight: 50,
                returnImageWidth: 50,
            });

            const strokes = response.data.transformedData;
            
            expect(response.data.transformedData[2]).toBeDefined();
            expect(strokes.length).toEqual(3);
            expect(response.data.transformedData[2].stroke.split('\n').length).toEqual(50);
            expect(response.data.transformedData[2].stroke.split('\n')[0].length).toEqual(50);
        });

        it('should return character with requested height and width and write the entire data', async () => {
            // prettier-ignore
            const expectedSkeleton = 
                '00000000000000000000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000000000000000000' + '\n' +
                '00000000000000000000010000000000000000000000000000' + '\n' +
                '00000000000000000000010000000000000000000000000000' + '\n' +
                '00000000000000000000010000000000000000000000000000' + '\n' +
                '00000000000000000000010000000000000000000000000000' + '\n' +
                '00001000000000000000010000000000000000000000000000' + '\n' +
                '00001000000000000000010000000000000000000000000000' + '\n' +
                '00001000000000000000010000000000000000000000000000' + '\n' +
                '00001000000000000000010000000000000000000000000000' + '\n' +
                '00001000000000000000010000000000000000000000000000' + '\n' +
                '00001000000000000000010000000000000000000000000000' + '\n' +
                '00001000000000000000010000000000000000000000000000' + '\n' +
                '00001000000000000000010000000000000000000000000000' + '\n' +
                '00001000000000000000010000000000000000000000000000' + '\n' +
                '00001000000000000000010000000000000000000000000000' + '\n' +
                '00000100000000000000010000000000000000000000000000' + '\n' +
                '00000111111111111111110000000000000000000000000000' + '\n' +
                '00000000000000000000010000000000000000000000000000' + '\n' +
                '00000000000000000000011000000000000000000000000000' + '\n' +
                '00000000000000000000001111111000000000000000000000' + '\n' +
                '00000000000000000000000100000111111110000000000000' + '\n' +
                '00000000000000000000000100000000000001111000000000' + '\n' +
                '00000000000000000000000100000000000000000110000000' + '\n' +
                '00000000000000000000000100000000000000000011000000' + '\n' +
                '00000000000000000000000100000000000000000001000000' + '\n' +
                '00000000000000000000000100000000000000000000100000' + '\n' +
                '00000000000000000000000100000000000000000000100000' + '\n' +
                '00000000000000000000000100000000000000000000010000' + '\n' +
                '00000000000000000000000100000000000000000000010000' + '\n' +
                '00000000000000000000000100000000000000000000010000' + '\n' +
                '00000000000000000000000100000000000000000000001000' + '\n' +
                '00000000000000000000000100000000000000000000000000' + '\n' +
                '00000000000000000000011111110000000000000000000000' + '\n' +
                '00000000000000000000100000001000000000000000000000' + '\n' +
                '00000000000000000001000000001100000000000000000000' + '\n' +
                '00000000000000000010000000000010000000000000000000' + '\n' +
                '00000000000000000100000000000001100000000000000000' + '\n' +
                '00000000000000001100000000000000010000000000000000' + '\n' +
                '00000000000000110000000000000000011000000000000000' + '\n' +
                '00000000000001000000000000000000000110000000000000' + '\n' +
                '00000000000111000000000000000000000011000000000000' + '\n' +
                '00000000001000000000000000000000000000110000000000' + '\n' +
                '00000000000000000000000000000000000000001000000000' + '\n' +
                '00000000000000000000000000000000000000000000000000' + '\n' +
                '00000000000000000000000000000000000000000000000000';
                
            const sampleImageUrl = './test/integration/data/zou_charactrer_denoised_prepared.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');
    
            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'zou_charactrer_denoised_prepared',
                type: IMAGEDATATYPE.PNG,
                compression: COMPRESSIONTYPE.PLAIN,
                data: arrayBuffer,
                returnCompression: COMPRESSIONTYPE.GZIP,
                returnImageHeight: 50,
                returnImageWidth: 50,
            });
    
            const skeleton = (await ungzip(Buffer.from(response.data.transformedData[2].stroke, 'base64'))).toString();
            const skeletonImage = await Jimp.read(await ungzip(Buffer.from(response.data.transformedData[2].strokeImage, 'base64')));
            expect(response.data).toBeDefined();
            expect(skeleton).toEqual(expectedSkeleton);

            await fs.writeFile('./test/integration/data/output_zou_character_denoised_prepared_test.json', JSON.stringify(response.data), { flag: 'w+' });
            await skeletonImage.blur(1).grayscale().writeAsync('./test/integration/data/output_zou_character_denoised_prepared_test.png');
        });

        it('should return skeletonized a preprocessed image', async () => {
            // prettier-ignore
            const sampleImageUrl = './test/integration/data/running_man_image_4_preprocessed_mirror.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');
    
            const response = await axiosClient.post<SkeletonizeResponse>(skeletonizeUrl, {
                name: 'running_man_image_5_preprocessed_mirror',
                type: IMAGEDATATYPE.PNG,
                compression: COMPRESSIONTYPE.PLAIN,
                data: arrayBuffer,
                returnCompression: COMPRESSIONTYPE.GZIP,
                returnImageHeight: 50,
                returnImageWidth: 50,
            });
    
            const skeletonImage = await Jimp.read(await ungzip(Buffer.from(response.data.transformedData.find(t => t.type === 'SKELETON')?.strokeImage || '', 'base64')));
            expect(response.data).toBeDefined();
            await skeletonImage.writeAsync('./test/integration/data/running_man_image_4_preprocessed_mirror_skeletonized_test.png');
        });
    });
});
