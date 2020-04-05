import express from 'express';
import reservasController from '../../controllers/v1/reservas-controller';
import { isAuth, isAdmin } from '../../middlewares/Auth';

const router = express.Router();
router.get('/get-all', isAuth, isAdmin, reservasController.getAllReservas);
router.get('/getByPersona', isAuth, reservasController.getReservasByPersona);
router.post('/create', isAuth, reservasController.createReserva);
router.put('/update', isAuth, reservasController.updateReserva);

export default router;
