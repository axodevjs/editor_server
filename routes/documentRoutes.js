import Router from 'express'
import DocumentController from "../controllers/DocumentController.js";
import authMiddleware from "../middleware/auth.middleware.js";

const documentRoutes = new Router()

documentRoutes.post('/', authMiddleware, DocumentController.create)
documentRoutes.get('/:id', authMiddleware, DocumentController.getOne)
documentRoutes.get('/all/:userId', authMiddleware, DocumentController.getAllByUserId)
documentRoutes.put('/:id', authMiddleware, DocumentController.update)
documentRoutes.delete('/:id', authMiddleware, DocumentController.delete)
//
// documentRoutes.post('/documents/:id/inviteUser', authMiddleware, DocumentController.inviteUser)
//
// documentRoutes.post('/documents/:id/commit', authMiddleware, DocumentController.createCommit)
// documentRoutes.put('/documents/:id/commit', authMiddleware, DocumentController.updateCommit)

export default documentRoutes