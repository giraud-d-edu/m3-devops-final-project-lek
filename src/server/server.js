import { MongoClient } from 'mongodb';
import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { collectDefaultMetrics, register } from 'prom-client';

import './initialize-db';
import { authenticationRoute } from './authenticate';
import { connectDB } from './connect-db';
import { addNewTask, updateTask } from './communicate-db';

let port = process.env.PORT;
let app = express();

collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.use(
    cors(),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json()
);

app.listen(port, console.info("Server running, listening on port ", port));

authenticationRoute(app);


if (process.env.NODE_ENV == `production`) {
    app.use(express.static(path.resolve(__dirname, '../../dist')));
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('index.html'));
    });
}

app.post('/task/new', async (req, res) => {
    await addNewTask(req.body.task);
    res.status(200).send();
});

app.post('/task/update', async (req, res) => {
    let db = await connectDB();
    await updateTask(req.body.task);
    res.status(200).send();
});

app.post('/comment/new', async (req, res) => {
    let comment = req.body.comment;
    let db = await connectDB();
    let collection = db.collection(`comments`);
    await collection.insertOne(comment);
    res.status(200).send();
});
