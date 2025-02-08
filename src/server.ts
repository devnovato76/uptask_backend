import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {corsConfig} from './config/cors';
import morgan from 'morgan';
import { connectDB } from './config/db.ts';
import authRoutes from './routes/authRoutes.ts';
import projectRoutes from './routes/projectRoutes.ts';

dotenv.config();

connectDB();

const app = express();

app.use(cors(corsConfig))

app.use(morgan('dev'))

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);



export default app;