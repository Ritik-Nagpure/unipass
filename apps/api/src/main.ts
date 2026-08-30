
import express from 'express';
import * as path from 'path';
import cors from 'cors';

const app = express();

app.use(cors({ origin:"http://localhost:3000"}));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  const time = new Date().toLocaleTimeString()
  res.send({ message: `The Api is running fine response sent at ${time}` });
});

const port = process.env.BACKEND_PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
