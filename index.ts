import express, { Express } from 'express';
import dotenv from 'dotenv';
import routers from "./routes";
import morgan from 'morgan'
import WhatsappInstance from './controller/whatsapp/instance';
import './controller/whatsapp/instance'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('combined'))

app.use(routers)

declare global {
    var instance:  WhatsappInstance
}

globalThis.instance = new WhatsappInstance()

app.listen(port, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});