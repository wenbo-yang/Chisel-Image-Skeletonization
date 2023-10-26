import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { ControllerFactory } from './controller/controllerFactory';

const httpsPort = 3000;
const httpPort = 5000;

const privateKey = fs.readFileSync('./certs/key.pem');
const certificate = fs.readFileSync('./certs/cert.crt');

const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));

app.get('/healthCheck', (req, res) => {
    res.send('i am healthy!!!');
});

app.post('/skeletify', async (req, res) => {
    const skeletifyController = ControllerFactory.makeSkeletifyController();
    const data = await skeletifyController.skeletify(req);

    res.send(data);
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(httpsPort, () => {
    console.log(`https server is listening at port ${httpsPort}`);
});

httpServer.listen(httpPort, () => {
    console.log(`http server is listening at port ${httpPort}`);
});
