import Router from 'express'
import dotenv from 'dotenv';
import UserController from "../controllers/UserController.js";
import authMiddleware from '../middleware/auth.middleware.js';

dotenv.config();

const authRoutes = new Router()

authRoutes.post('/registration', UserController.registration)
authRoutes.post('/login', UserController.login)
authRoutes.get('/auth', authMiddleware, UserController.auth)

export default authRoutes