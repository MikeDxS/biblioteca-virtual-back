import { Request, Response } from 'express';
import Conexion from '../../utils/conexion';

const createReserva = async (req: Request, res: Response): Promise<void> => {
  try {
    const conexion = Conexion.getConexion();
    const pool = conexion.getPool();
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const { isbn } = req.body;
    const { userId } = req.sessionData;
    const consulta = 'INSERT INTO reservas(k_nickname, k_isbn, d_fecha_reserva, d_fecha_devolucion) VALUES ($1, $2, current_date, current_date+30)';
    await pool.query(consulta, [userId, isbn]);
    res.json({ message: 'Reserva creada exitosamente' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error });
  }
};

const getAllReservas = async (req: Request, res: Response): Promise<void> => {
  try {
    const conexion = Conexion.getConexion();
    const pool = conexion.getPool();
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const data = await pool.query('SELECT * FROM reservas');
    const result = data.rows;
    res.json({ status: 'OK', message: result });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error });
  }
  res.json({ saludo: 'hola' });
};

const getReservasByPersona = async (req: Request, res: Response): Promise<void> => {
  try {
    const conexion = Conexion.getConexion();
    const pool = conexion.getPool();
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const { userId } = req.sessionData;
    const consulta = 'SELECT * FROM reservas WHERE k_nickname = $1';
    const data = await pool.query(consulta, [userId]);
    const result = data.rows;
    res.json({ status: 'OK', message: result });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error });
  }
};

const updateReserva = async (req: Request, res: Response): Promise<void> => {
  const conexion = Conexion.getConexion();
  const pool = conexion.getPool();
  if (!conexion.getIsConnected()) {
    await pool.connect();
    conexion.setIsConnected(true);
  }
  const { idReserva } = req.body;
  const { userId } = req.sessionData;
  res.json({ mensaje: 'De ser necesario se implementara', idReserva, userId });
};

export default {
  createReserva, getAllReservas, getReservasByPersona, updateReserva,
};
