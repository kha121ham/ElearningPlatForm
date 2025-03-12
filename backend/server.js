import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 5000;
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
const app = express();


//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser middleware
app.use(cookieParser());


//ConnectDB
connectDB();


//Set __dirname to current dir
const __dirname = path.resolve();
app.use('/uploads',express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    //any route that is not api will be redirect to index.html
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
    } else {
        //Start app
        app.get('/', (req, res)=> {
            res.send('API is running...');
            });
    } 

//Define routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/orders', orderRoutes);

//error middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));