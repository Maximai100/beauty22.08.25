import express from 'express';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import cors from 'cors';
import { INITIAL_DATA } from '../constants';
import type { LandingPageData } from '../types';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/initial-data', (req: ExpressRequest, res: ExpressResponse<LandingPageData>) => {
  res.json(INITIAL_DATA);
});

app.listen(port, () => {
  console.log(`[Server] Listening on http://localhost:${port}`);
});
