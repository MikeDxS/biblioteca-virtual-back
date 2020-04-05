import { Client } from 'pg';
// eslint-disable-next-line no-unused-vars
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routesV1 from './routes/v1';

dotenv.config();

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
});
const app: Application = express();
app.use(bodyParser.json());
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
