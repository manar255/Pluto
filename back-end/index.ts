import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import db from './config/database';

import authRouter from './Routers/auth';

const port = process.env.PORT || 5000;


dotenv.config();
const app = express();


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

//router
app.use('/api/auth', authRouter);


//Error handling 
interface CustomError extends Error {
    statusCode?: number;
}

const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    const status = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(status).json({ message });
};
app.use(errorHandler)

//database connection
db.authenticate()
    .then(() => {
        console.log('Database connected');
    })
    .catch(error => {
        console.error('Error syncing database', error);
    });

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});