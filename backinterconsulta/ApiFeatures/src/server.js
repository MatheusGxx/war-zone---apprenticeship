import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import limiter from './utils/RateLimit.js'
import db from '../MongoDB/connect.js';
import routes from './routes/index.js';
import { Server } from 'socket.io'

const app = express();

const server = createServer(app)
export const io = new Server(server, {
  cors:{
    origin: 'http://localhost:3000'
  }
})

/*app.use(limiter)*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.connect();
app.use(cors());             
app.use('/uploads', express.static('uploads'));
app.use('/icons', express.static('icons'))
app.use('/icons-doencas', express.static('icons-doencas'))
app.use(routes)

const PortServer =  8080

server.listen(PortServer, () => console.log(`API de feature aberta na porta, ${PortServer}`))
