import Router from 'express'
import InviteController from "../controllers/InviteController.js";
import authMiddleware from "../middleware/auth.middleware.js";

const inviteRoutes = new Router()

inviteRoutes.post('/', authMiddleware, InviteController.create)
inviteRoutes.post('/use/:id', authMiddleware, InviteController.use)

export default inviteRoutes