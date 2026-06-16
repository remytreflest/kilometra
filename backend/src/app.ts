import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import todosRouter from './modules/todos/todos.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { formatResponse } from './utils/response';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json(formatResponse({ status: 'ok', uptime: process.uptime() }));
});

app.use('/api/todos', todosRouter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler
app.use(errorMiddleware as any);

export default app;
