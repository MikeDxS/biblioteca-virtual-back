import express from 'express';
import libros from '../../controllers/v1/libros-controller';
import { isAuth, isAdmin } from '../../middlewares/Auth';

const router = express.Router();
router.get('/get-all', libros.getAllLibros);
router.post('/create', isAuth, libros.createLibro);
router.put('/update/:id', isAuth, libros.updateLibro);
router.delete('/delete', isAdmin, isAuth, libros.deleteLibro);

export default router;
