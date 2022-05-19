import { currentUser, errorHandler, NotFoundError, routeLogger } from '@rccsilva-ticketing/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true)

app.use(json());

if (process.env.NODE_ENV !== 'test') {
  app.use(routeLogger)
}

app.use(cookieSession({
  signed: false,
  secure: false
}))

app.use(currentUser)
app.use(createChargeRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler);

export { app };

