import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // <--- Import this
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import YAML from "yamljs"
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { AppError } from './utils/AppError';
import { Request, Response, NextFunction } from 'express';
import {  inngest,functions } from './inngest';
import { serve } from "inngest/express";



// Routes
import authRoutes from './routes/authRoutes';
// import documentRoutes from './routes/document.routes';
// import aiRoutes from './routes/ai.routes';
// import codeRoutes from './routes/code.routes';


// import { errorHandler, notFound } from './middleware/error.middleware';
// import { authMiddleware } from './middleware/auth.middleware';

dotenv.config()

const app = express();
const httpServer = createServer(app);


const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is missing in .env');
}
 const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({
  adapter: adapter,
});

const swaggerDocument = YAML.load('./swagger.yaml');

// Security & Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100
  });
  app.use('/api/', limiter);

  export const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // Allow all origins for development
      methods: ['GET', 'POST'],
    },
  });


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// inngest.send({
//   name: "document/index.requested",
//   data: {
//     documentId: "123",
//     userId:"456",
//     fileUrl:"./mypdf",
//   },
// })

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/documents', authMiddleware, documentRoutes);
// app.use('/api/ai', authMiddleware, aiRoutes);
// app.use('/api/code', authMiddleware, codeRoutes);
// app.use("/api/inngest", serve({ client: inngest, functions }));
// app.get("/api/hello", async function (req, res, next) {

//   await inngest.send({
//     name: "document/index.requested",
//     data: {
//       documentId: "123",
//       userId:"456",
//       fileUrl:"./mypdf",
//     },
//   })
//   res.send("hello")
// })

// app.use("/api/inngest", serve({ client: inngest, functions }));




// app.all('/*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
//   });
  
  app.use((err:AppError, req:Request, res:Response, next:NextFunction) => {
      const statusCode = err.statusCode || 500;
      const status = err.status || 'error';
    
      res.status(statusCode).json({
        status: status,
        message: err.message,
        stack: err.stack 
      });
    });




const PORT = process.env.PORT || 5000;

const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
console.log(firstDay)

const startServer = async () => {

    try {
      await prisma.$connect();
      console.log('✅ Database connected');
      
      httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();


  
export default app;





