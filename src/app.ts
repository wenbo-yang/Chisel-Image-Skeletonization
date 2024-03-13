import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { ControllerFactory } from './controller/controllerFactory';
import { Config } from './config';

const config = new Config();

const servicePorts = config.servicePorts;

const privateKey = fs.readFileSync('./certs/key.pem');
const certificate = fs.readFileSync('./certs/cert.crt');

const credentials = { key: privateKey, cert: certificate };

process.title = config.shortName;

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));

app.get('/healthCheck', (req, res) => {
    res.send('i am healthy!!!');
});

app.post('/skeletonize', async (req, res) => {
    try {
        const skeletonizeController = ControllerFactory.makeSkeletonizeController(config);
        const data = await skeletonizeController.skeletonize(req);

        res.send(data);
    } catch (e) {
        console.log(e as Error);
        res.send(e).status(500);
    }
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(servicePorts.https, () => {
    console.log(`https server is listening at port ${servicePorts.https}`);
});

httpServer.listen(servicePorts.http, () => {
    console.log(`http server is listening at port ${servicePorts.http}`);
});
