import { Client } from 'pg';
// eslint-disable-next-line no-unused-vars
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import routesV1 from './routes/v1';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

declare global{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express{
      export interface Request{
        sessionData: any;
      }
    }
  }

const client = new Client({
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
const app: Application = express();
app.use(bodyParser.json());
// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

routesV1(app);
const port: number | string = process.env.PORT || 5000;
client.connect()
  .then(() => {
    console.log('Conectado a postgreSQL');
    app.listen(port, () => {
      console.log('Corriendo en', port);
    });
  })
  .catch((error) => {
    console.log('Ocurrió un error al conectarse', error);
  });
