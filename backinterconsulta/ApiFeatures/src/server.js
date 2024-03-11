import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import limiter from './utils/RateLimit.js';
import db from '../MongoDB/connect.js';
import routes from './routes/index.js';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const allowedOrigins = ['http://localhost:3000', 'https://your-production-domain.com'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect();

app.use('/uploads', express.static('uploads'));
app.use('/icons', express.static('icons'));
app.use('/icons-doencas', express.static('icons-doencas'));
app.use('/documents', express.static('pdfs'));

app.use(routes);

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`API de feature aberta na porta ${PORT}`);
});
