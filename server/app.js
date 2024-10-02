import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from './Routes/User.js'
import booksRoute from './Routes/Books.js'
import rentalRoute from './Routes/Rental.js'
const PORT = process.env.PORT || 1000;
// const mongoDbUri = 'mongodb://127.0.0.1:27017/Internship'
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongodb = await mongoose.connect('mongodb://127.0.0.1:27017/Internship');

app.use('/auth', userRouter);
app.use('/books', booksRoute);
app.use('/rental', rentalRoute)

app.listen(PORT, mongodb, () => {
    console.log('server started', PORT)
})