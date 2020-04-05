// eslint-disable-next-line no-unused-vars
import { Application, Request, Response } from 'express';
import librosRoutes from './libros-routes';
import reservasRoutes from './reservas-routes';
import usuarioRoutes from './users-routes';

export default (app: Application): void => {
  app.get('/api/v1', (req: Request, res: Response) => {
    res.send({ user: 'hola' });
  });
  app.use('/api/v1/usuarios', usuarioRoutes);
  app.use('/api/v1/libros', librosRoutes);
  app.use('/api/v1/reservas', reservasRoutes);
};
