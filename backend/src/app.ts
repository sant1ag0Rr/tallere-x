import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './presentation/routes/userRoutes';
import appointmentRoutes from './presentation/routes/appointmentRoutes';
import vehicleRoutes from './presentation/routes/vehicleRoutes';
import inventoryRoutes from './presentation/routes/inventoryRoutes';
import invoiceRoutes from './presentation/routes/invoiceRoutes';
import workOrderRoutes from './presentation/routes/workOrderRoutes';
import feedbackRoutes from './presentation/routes/feedbackRoutes';
import authRoutes from './presentation/routes/authRoutes';
import { authMiddleware } from './presentation/middlewares/authMiddleware';
import { errorMiddleware, notFoundMiddleware } from './presentation/middlewares/errorMiddleware';
import { sanitizeMiddleware } from './presentation/middlewares/sanitizeMiddleware';
import { swaggerSpec } from './presentation/docs/swagger';

const app: Application = express();

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
}));
app.use(express.json());
app.use(sanitizeMiddleware);

// Basic health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/appointments', authMiddleware, appointmentRoutes);
app.use('/api/vehicles', authMiddleware, vehicleRoutes);
app.use('/api/inventory', authMiddleware, inventoryRoutes);
app.use('/api/invoices', authMiddleware, invoiceRoutes);
app.use('/api/work-orders', authMiddleware, workOrderRoutes);
app.use('/api/feedback', authMiddleware, feedbackRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
