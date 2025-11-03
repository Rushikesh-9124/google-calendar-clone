import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './src/config/db.js';
import eventRoutes from './src/routes/eventRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js'
dotenv.config();


const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({origin: '*'}))
app.use('/api/events', eventRoutes);
app.use('/api/events', taskRoutes)
connectDB()

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API Working"
    })
  });
  
app.listen(PORT, ()=>{
    console.log('Server is listening on http://localhost:4000')
})

export default app
