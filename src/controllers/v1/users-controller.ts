/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Conexion from '../../utils/conexion';

const expiresIn = 60 * 20;
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const conexion = Conexion.getConexion();
    const pool = conexion.getPool();
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const { nickname, password } = req.body;
    const consulta = 'SELECT * FROM personas WHERE k_nickname=$1';
    const data = await pool.query(consulta, [nickname]);
    const user = data.rows[0];
    if (user) {
      const isOK = await bcrypt.compare(password, user.n_pass);
      if (isOK) {
        const token = jwt.sign({ userId: user.k_nickname, role: user.n_rol },
          process.env.JWT_SECRET!, { expiresIn });
        res.send({ status: 'OK', data: { token }, expiresIn });
      } else {
        res.status(403).send({ status: 'INVALID_PASSWORD', message: 'Contrasena incorrecta' });
      }
    } else {
      res.status(204).send({ status: 'USER_NOT_FOUND', message: 'No existe el susuario vinculado' });
    }
  } catch (e) {
    res.status(500).send({ status: 'ERROR', message: e.message });
  }
};
const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const conexion = Conexion.getConexion();
    const pool = conexion.getPool();
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const {
      nickname, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 15);
    const consulta = 'INSERT INTO public.personas(k_nickname, u_correo, n_pass, n_rol) VALUES ($1, $2, $3, $4)';
    await pool.query(consulta, [nickname, email, hash, 'client']);
    res.send({ status: 'OK', message: 'User created' });
  } catch (error) {
    if (error.code && error.code === '23505') {
      res.status(400).send({ status: 'DUPLICATED_VALUES', message: error.detail });
      return;
    }
    res.status(500).send({ status: 'ERROR', message: error });
  }
};
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const conexion = Conexion.getConexion();
    const pool = conexion.getPool();
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const { nickname } = req.body;
    if (!nickname) {
      throw new Error('missing params userId');
    }
    const consulta = `DELETE FROM personas WHERE k_nickname=${nickname}`;
    await pool.query(consulta);
    //eliminar sus reservas
    res.send({ status: 'OK', message: 'User deleted' });
  } catch (e) {
    res.status(500).send({ status: 'ERROR', message: e });
  }
};
const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const conexion = Conexion.getConexion();
    const pool = conexion.getPool();
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const consulta = 'SELECT k_nickname, u_correo FROM personas';
    const data = await pool.query(consulta);
    const users = data.rows;
    res.send({ status: 'OK', message: users });
  } catch (e) {
    res.status(500).send({ status: 'ERROR', message: e });
  }
  res.send({ status: 'OK', data: 'Algun usuario' });
};
const updateUser = async (req: Request, res: Response): Promise<void> => {
  const {
    email,
  } = req.body;
  const { userId } = req.sessionData;
  try {
    const conexion = Conexion.getConexion();
    const pool = conexion.getPool();
    if (!conexion.getIsConnected()) {
      await pool.connect();
      conexion.setIsConnected(true);
    }
    const consulta = 'UPDATE personas SET k_nickname = $1, u_correo = $2 WHERE k_nickname = $1';
    await pool.query(consulta, [userId, email]);
    res.send({ status: 'OK', message: 'User updated' });
  } catch (error) {
    if (error.code && error.code === '23505') {
      res.status(400).send({ status: 'DUPLICATED_VALUES', message: error.detail });
    }
    res.status(500).send({ status: 'ERROR', message: error });
  }
};

export default {
  createUser, deleteUser, getUsers, updateUser, login,
};
