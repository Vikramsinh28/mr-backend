import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

// Load environment variables
dotenv.config();

// Import routes
import apiRoutes from "./routes/index.js";

// Import Swagger documentation
import swaggerSpec from "./docs/swagger.js";

// Import error handler
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Basic health check route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "RBAC CRM API is running",
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "RBAC CRM API",
    version: "1.0.0",
    documentation: "/api/docs",
    endpoints: {
      health: "/health",
      docs: "/api/docs",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
        profile: "GET /api/auth/profile",
      },
      users: {
        list: "GET /api/users",
        get: "GET /api/users/:id",
        create: "POST /api/users",
        update: "PATCH /api/users/:id",
        delete: "DELETE /api/users/:id",
      },
      expenses: {
        list: "GET /api/expenses",
        get: "GET /api/expenses/:id",
        create: "POST /api/expenses",
        update: "PATCH /api/expenses/:id",
        delete: "DELETE /api/expenses/:id",
        approve: "POST /api/expenses/:id/approve",
      },
      doctors: {
        list: "GET /api/doctors",
        get: "GET /api/doctors/:id",
        create: "POST /api/doctors",
        update: "PATCH /api/doctors/:id",
        delete: "DELETE /api/doctors/:id",
      },
    },
  });
});

// API Routes
app.use("/api", apiRoutes);

// Swagger API Documentation
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "RBAC CRM API Documentation",
    customfavIcon: "/favicon.ico",
  })
);

// 404 handler (must be before error handler)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    details: {
      path: req.path,
      method: req.method,
    },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
