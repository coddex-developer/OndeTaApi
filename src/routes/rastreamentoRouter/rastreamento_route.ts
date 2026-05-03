import {Router} from "express";
import rastreamentoController from "../../controllers/rastreamentoController/rastreamento_controller";
import { authMiddleware } from "../../middlewares/auth";

const rastreamentoRouter = Router();

// Todas as rotas de rastreamento requerem autenticação
rastreamentoRouter.use(authMiddleware);

rastreamentoRouter.post('/', rastreamentoController.createRastreamento);
rastreamentoRouter.get('/', rastreamentoController.getRastreamentos);
rastreamentoRouter.get('/:id', rastreamentoController.getRastreamentoById);
rastreamentoRouter.patch('/:id', rastreamentoController.updateRastreamento);
rastreamentoRouter.delete('/:id', rastreamentoController.deleteRastreamento);
rastreamentoRouter.post('/:id/eventos', rastreamentoController.addEvento);

export default rastreamentoRouter;