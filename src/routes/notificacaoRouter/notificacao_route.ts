import {Router} from "express";
import notificacaoController from "../../controllers/notificacaoController/notificacao_controller";
import { authMiddleware } from "../../middlewares/auth";

const notificacaoRouter = Router();

// Todas as rotas de notificação requerem autenticação
notificacaoRouter.use(authMiddleware);

notificacaoRouter.post('/', notificacaoController.createNotificacao);
notificacaoRouter.get('/', notificacaoController.getNotificacoes);
notificacaoRouter.get('/:id', notificacaoController.getNotificacaoById);
notificacaoRouter.patch('/:id', notificacaoController.updateNotificacao);
notificacaoRouter.delete('/:id', notificacaoController.deleteNotificacao);
notificacaoRouter.patch('/:id/read', notificacaoController.markAsRead);
notificacaoRouter.patch('/read-all', notificacaoController.markAllAsRead);

export default notificacaoRouter;