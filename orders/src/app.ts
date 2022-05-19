import { currentUser, errorHandler, NotFoundError, routeLogger } from '@rccsilva-ticketing/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';


const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(routeLogger)

app.use(cookieSession({
  signed: false,
  secure: false
}))

app.use(currentUser)
app.use(indexOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)
app.use(newOrderRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler);

export { app };

