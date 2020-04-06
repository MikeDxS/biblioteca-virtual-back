/* eslint-disable max-len */
import { Pool, Client } from 'pg';
import fs from 'fs';
import path from 'path';

export class Conexion {
    private client: Client | undefined;

    private static conexion: Conexion;

    private isConnected: boolean;

    private constructor() {
      this.client = undefined;
      this.isConnected = false;
    }

    public static getConexion(): Conexion {
      if (this.conexion === undefined) {
        this.conexion = new Conexion();
        return this.conexion;
      }
      return this.conexion;
    }

    public getPool(): Client {
      if (this.client === undefined) {
        this.client = new Client({
          user: 'postgres',
          host: process.env.POSTGRES,
          database: 'biblioteca',
          password: process.env.PG_PASS,
          port: 5432,
          // ssl: {
          //   ca: fs.readFileSync(path.join(__dirname, './certificados/server-ca.pem')).toString(),
          //   key: fs.readFileSync(path.join(__dirname, './certificados/client-key.pem')).toString(),
          //   cert: fs.readFileSync(path.join(__dirname, './certificados/client-cert.pem')).toString(),
          // },
        });
        return this.client;
      }
      return this.client;
    }

    public getIsConnected(): boolean {
      return this.isConnected;
    }

    public setIsConnected(isConnected: boolean): void {
      this.isConnected = isConnected;
    }
}
export default Conexion;
