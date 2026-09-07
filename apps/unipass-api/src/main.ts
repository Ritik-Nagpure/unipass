import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });

});
app.get('/check', (req, res) => {
  res.status(200).send({ msg : 'unipass api is up and running correct. integrate to make ui work' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
