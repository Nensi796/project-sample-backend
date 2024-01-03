import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import { errorMiddleware } from '@middlewares/errorHandler';
import { NotFoundError } from '@utils/NotFoundError';
import routes from '../route';

dotenv.config();

const app: express.Application = express();
app.set('view engine', 'ejs');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
  }),
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/healthCheck', async (req, res) => {
  //   await getUsers(req,res)
  res.status(200).send('Server is running');
});
app.use('/v1', routes);
// app.get('/errorTest',getUsers);
app.all('*', (req: Request, res: Response) => {
  throw new NotFoundError();
});
app.use(errorMiddleware);

export default app;
