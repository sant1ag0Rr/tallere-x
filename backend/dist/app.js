"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const userRoutes_1 = __importDefault(require("./presentation/routes/userRoutes"));
const appointmentRoutes_1 = __importDefault(require("./presentation/routes/appointmentRoutes"));
const vehicleRoutes_1 = __importDefault(require("./presentation/routes/vehicleRoutes"));
const inventoryRoutes_1 = __importDefault(require("./presentation/routes/inventoryRoutes"));
const invoiceRoutes_1 = __importDefault(require("./presentation/routes/invoiceRoutes"));
const workOrderRoutes_1 = __importDefault(require("./presentation/routes/workOrderRoutes"));
const feedbackRoutes_1 = __importDefault(require("./presentation/routes/feedbackRoutes"));
const authRoutes_1 = __importDefault(require("./presentation/routes/authRoutes"));
const authMiddleware_1 = require("./presentation/middlewares/authMiddleware");
const errorMiddleware_1 = require("./presentation/middlewares/errorMiddleware");
const sanitizeMiddleware_1 = require("./presentation/middlewares/sanitizeMiddleware");
const swagger_1 = require("./presentation/docs/swagger");
const app = (0, express_1.default)();
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
}));
app.use(express_1.default.json());
app.use(sanitizeMiddleware_1.sanitizeMiddleware);
// Basic health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', authMiddleware_1.authMiddleware, userRoutes_1.default);
app.use('/api/appointments', authMiddleware_1.authMiddleware, appointmentRoutes_1.default);
app.use('/api/vehicles', authMiddleware_1.authMiddleware, vehicleRoutes_1.default);
app.use('/api/inventory', authMiddleware_1.authMiddleware, inventoryRoutes_1.default);
app.use('/api/invoices', authMiddleware_1.authMiddleware, invoiceRoutes_1.default);
app.use('/api/work-orders', authMiddleware_1.authMiddleware, workOrderRoutes_1.default);
app.use('/api/feedback', authMiddleware_1.authMiddleware, feedbackRoutes_1.default);
app.use(errorMiddleware_1.notFoundMiddleware);
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
