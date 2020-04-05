import express from 'express';
import userController from '../../controllers/v1/users-controller';
import { isAdmin, isAuth } from '../../middlewares/Auth';

const router = express.Router();

router.get('/get-all', isAuth, isAdmin, userController.getUsers);
router.post('/login', userController.login);
router.post('/create', userController.createUser);
router.put('/update', isAuth, userController.updateUser);
router.delete('/delete', isAuth, isAdmin, userController.createUser);


export default router;
