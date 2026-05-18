import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './presentation/routes/userRoutes';
import appointmentRoutes from './presentation/routes/appointmentRoutes';
import vehicleRoutes from './presentation/routes/vehicleRoutes';
import inventoryRoutes from './presentation/routes/inventoryRoutes';
import invoiceRoutes from './presentation/routes/invoiceRoutes';
import workOrderRoutes from './presentation/routes/workOrderRoutes';
import feedbackRoutes from './presentation/routes/feedbackRoutes';
import { authMiddleware } from './presentation/middlewares/authMiddleware';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected Routes
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/appointments', authMiddleware, appointmentRoutes);
app.use('/api/vehicles', authMiddleware, vehicleRoutes);
app.use('/api/inventory', authMiddleware, inventoryRoutes);
app.use('/api/invoices', authMiddleware, invoiceRoutes);
app.use('/api/work-orders', authMiddleware, workOrderRoutes);
app.use('/api/feedback', authMiddleware, feedbackRoutes);

export default app;
