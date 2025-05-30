"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_service_1 = require("../services/database.service");
const dbService = new database_service_1.DatabaseService();
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Check if user already exists
                const existingUser = yield dbService.getUserByEmail(email);
                if (existingUser) {
                    return res.status(400).json({ message: 'User already exists' });
                }
                // Hash password
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                // Create user
                const user = yield dbService.createUser(email, hashedPassword, 'customer');
                // Generate token
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '24h' });
                res.status(201).json({
                    message: 'User registered successfully',
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }
                });
            }
            catch (error) {
                console.error('Registration error:', error);
                res.status(500).json({ message: 'Error registering user' });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Get user
                const user = yield dbService.getUserByEmail(email);
                if (!user || !user.password) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                // Verify password
                const validPassword = yield bcryptjs_1.default.compare(password, user.password);
                if (!validPassword) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                // Generate token
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '24h' });
                res.json({
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }
                });
            }
            catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ message: 'Error logging in' });
            }
        });
    }
}
exports.AuthController = AuthController;
