import * as dotenv from 'dotenv';
import { createApp } from './app';

dotenv.config();

const port = process.env.BACKEND_PORT || 3001;

const app = createApp();

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);