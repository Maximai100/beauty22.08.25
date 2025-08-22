import express, { Request, Response } from 'express';
import cors from 'cors';
import { INITIAL_DATA } from '../constants';
import type { LandingPageData } from '../types';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/initial-data', (req: Request, res: Response<LandingPageData>) => {
  res.json(INITIAL_DATA);
});

app.listen(port, () => {
  console.log(`[Server] Listening on http://localhost:${port}`);
});
