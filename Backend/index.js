import express from 'express';
import cors from 'cors';

import config from './config.js';
import userRoute from './routes/userRoute.js';


const app = express();

//enables CORS for app
app.use(cors());
//server can access JSON body
app.use(express.json());

//middleware handles requests with given path
app.use('/api', userRoute);

//fires up api to specific port in config
app.listen(config.port, () =>
 console.log('Server is live @ ${config.hostUrl}'),
);