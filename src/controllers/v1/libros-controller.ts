import { Request, Response } from 'express';
import { Pool, Client } from 'pg';
import Conexion from '../../utils/conexion';

// metodo para crear añadir libros a la biblioteca
const createLibro = async (req: Request, res: Response): Promise<void> => {
  try {
    const conexion = Conexion.getConexion();
    const pool = conexion.getPool();
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const {
      isbn, titulo, autor, portada, stock,
    } = req.body;
    const consulta = 'INSERT INTO libros(k_isbn, n_titulo, n_autor, n_portada, v_stock) VALUES ($1, $2, $3, $4, $5)';
    const result = await pool.query(consulta, [isbn, titulo, autor, portada, stock]);
    res.json({ status: 'OK', message: 'Libro añadido' });
  } catch (error) {
    if (error.code && error.code === '23505') {
      res.status(400).send({ status: 'DUPLICATED_VALUES', message: error.detail });
    }
    res.status(500).json({ status: 'ERROR', message: error });
  }
};

const getAllLibros = async (req: Request, res: Response): Promise<void> => {
  try {
    const conexion = Conexion.getConexion();
    const pool = conexion.getPool();
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const result = await pool.query('SELECT * FROM libros');
    res.json({ status: 'OK', message: result.rows });
  } catch (err) {
    res.json({ error: err });
  }
};

const updateLibro = async (req: Request, res: Response): Promise<void> => {
  const conexion = Conexion.getConexion();
  const pool = conexion.getPool();
  try {
    const {
      isbn, titulo, autor, portada, stock,
    } = req.body;
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const consulta = 'UPDATE libros SET k_isbn = $1, n_titulo = $2, n_autor = $3, n_portada = $4, v_stock = $5 WHERE k_isbn = $1';
    await pool.query(consulta, [isbn, titulo, autor, portada, stock]);
    res.json({ status: 'OK', message: 'Libro Actualizado' });
  } catch (error) {
    res.json({ status: 'ERROR', message: error });
  }
};

const deleteLibro = async (req: Request, res: Response): Promise<void> => {
  res.json({ saludo: 'hola' });
};
export default {
  createLibro, updateLibro, deleteLibro, getAllLibros,
};
