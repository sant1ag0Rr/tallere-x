"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./presentation/routes/userRoutes"));
const appointmentRoutes_1 = __importDefault(require("./presentation/routes/appointmentRoutes"));
const vehicleRoutes_1 = __importDefault(require("./presentation/routes/vehicleRoutes"));
const inventoryRoutes_1 = __importDefault(require("./presentation/routes/inventoryRoutes"));
const invoiceRoutes_1 = __importDefault(require("./presentation/routes/invoiceRoutes"));
const workOrderRoutes_1 = __importDefault(require("./presentation/routes/workOrderRoutes"));
const feedbackRoutes_1 = __importDefault(require("./presentation/routes/feedbackRoutes"));
const authMiddleware_1 = require("./presentation/middlewares/authMiddleware");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Protected Routes
app.use('/api/users', authMiddleware_1.authMiddleware, userRoutes_1.default);
app.use('/api/appointments', authMiddleware_1.authMiddleware, appointmentRoutes_1.default);
app.use('/api/vehicles', authMiddleware_1.authMiddleware, vehicleRoutes_1.default);
app.use('/api/inventory', authMiddleware_1.authMiddleware, inventoryRoutes_1.default);
app.use('/api/invoices', authMiddleware_1.authMiddleware, invoiceRoutes_1.default);
app.use('/api/work-orders', authMiddleware_1.authMiddleware, workOrderRoutes_1.default);
app.use('/api/feedback', authMiddleware_1.authMiddleware, feedbackRoutes_1.default);
exports.default = app;
