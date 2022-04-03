import 'dotenv/config';
import { Kafka } from 'kafkajs';
import mongoose from 'mongoose';
import { Contact } from './schemas/Contact';

const { MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;

mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);

const kafka = new Kafka({
  clientId: 'my_app',
  brokers: ['localhost:9092'],
});

type ContactEvent = {
  name: string;
  to: string;
  subject: string;
  body: string;
};

(async () => {
  const consumer = kafka.consumer({ groupId: 'notification-group' });

  await consumer.connect();

  await consumer.subscribe({
    topic: 'email-notification',
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { value } = message;
      const parsed = JSON.parse(value?.toString() ?? '{}') as ContactEvent;

      const exists = await Contact.findOne({ email: parsed.to });
      if (!exists) {
        await Contact.create({
          name: parsed.name,
          email: parsed.to,
        });
      }

      console.log(`Received event ${parsed.name}`);
      console.log(`Received message ${value}`);
    },
  });
})();
