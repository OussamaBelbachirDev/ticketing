import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signoutRouter } from './routes/signout';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { ErrorHandler, NotFoundError } from '@ousstickets/common';

const app = express();
app.set('trust proxy', true); // ingress-nginx (trust traffic)
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signoutRouter);
app.use(signinRouter);
app.use(signupRouter);

app.use('*', async () => {
  throw new NotFoundError();
});

app.use(ErrorHandler);

export default app;
