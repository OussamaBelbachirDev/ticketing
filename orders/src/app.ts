import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { ErrorHandler, NotFoundError, currentUser } from '@ousstickets/common';
// ============================================================
import { indexOrderRouter } from './routes/index';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { deleteOrderRouter } from './routes/delete';
// ============================================================

const app = express();
app.set('trust proxy', true); // ingress-nginx (trust traffic)
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all('*', (req, res, next) => {
  next(new NotFoundError());
});

app.use(ErrorHandler);

export default app;
