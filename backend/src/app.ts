import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { errorMiddleware } from './middlewares/error.middleware';
import { formatResponse } from './utils/response';

import authRouter from './modules/auth/auth.routes';
import usersRouter from './modules/users/users.routes';
import tiresRouter from './modules/tires/tires.routes';
import wearRouter from './modules/wear/wear.routes';
import activitiesRouter from './modules/activities/activities.routes';
import clubsRouter from './modules/clubs/clubs.routes';
import leaderboardRouter from './modules/leaderboard/leaderboard.routes';
import performanceRouter from './modules/performance/performance.routes';
import dealersRouter from './modules/dealers/dealers.routes';
import reviewsRouter from './modules/reviews/reviews.routes';
import testerRouter from './modules/tester/tester.routes';
import adminRouter from './modules/admin/admin.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json(formatResponse({ status: 'ok', uptime: process.uptime() }));
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/tires', tiresRouter);
app.use('/api/wear', wearRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/clubs', clubsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/performance', performanceRouter);
app.use('/api/dealers', dealersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/tester', testerRouter);
app.use('/api/admin', adminRouter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorMiddleware as any);

export default app;
