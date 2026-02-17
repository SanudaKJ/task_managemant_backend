"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const app = (0, express_1.default)();
// Middlewares
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // your Next.js frontend
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(rateLimiter_1.rateLimiter); // Rate limiting
// Routes
app.use("/auth", auth_1.default);
app.use("/tasks", tasks_1.default);
// Error Handling
app.use(errorHandler_1.errorHandler);
exports.default = app;
