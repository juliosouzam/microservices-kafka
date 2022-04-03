import 'dotenv/config';
import express from 'express';
import { Kafka } from 'kafkajs';
import mongoose from 'mongoose';

const { MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;

mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);

import { routes } from './routes';

const kafka = new Kafka({
  clientId: 'my_app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const app = express();
app.use((request, _, next) => {
  request.producer = producer;

  return next();
});
app.use(express.json());
app.use(routes);

async function run() {
  await producer.connect();

  const PORT = process.env.PORT || 3333;

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

run().catch(console.error);
