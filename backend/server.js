import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 5000;
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();


//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser middleware
app.use(cookieParser());


//ConnectDB
connectDB();


app.get('/', (req,res) => {
    res.send('API is running...');
});

//Define routes
app.use('/api/users', userRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));