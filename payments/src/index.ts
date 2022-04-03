import 'dotenv/config';
import { Kafka } from 'kafkajs';
import mongoose from 'mongoose';

import { Payment } from './schemas/Payment';

const { MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;

mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);

const kafka = new Kafka({
  clientId: 'my_app',
  brokers: ['localhost:9092'],
});

type User = {
  id: string;
  name: string;
  email: string;
};

type Plan = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type PaymentEvent = {
  user: User;
  plan: Plan;
};

(async () => {
  const consumer = kafka.consumer({ groupId: 'payment-group' });
  const producer = kafka.producer();

  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({
    topic: 'payment-creating',
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { value } = message;
      const { plan, user } = JSON.parse(
        value?.toString() ?? '{}'
      ) as PaymentEvent;

      let payment = await Payment.findOne({
        user_id: user.id,
        plan_id: plan.id,
      });
      console.log(`#######################################`);
      if (!payment) {
        payment = await Payment.create({
          user_id: user.id,
          plan_id: plan.id,
          start_at: new Date(),
          expired_at: new Date(
            new Date().getTime() + plan.duration * 24 * 60 * 60 * 1000
          ),
          price: plan.price,
        });
        console.log(`Payment created with sucess`);
      }

      console.log(
        `User: ${user.name} - Plan: ${plan.name} - Price: ${payment.price}`
      );

      await producer.send({
        topic: 'email-notification',
        messages: [
          {
            value: JSON.stringify({
              name: user.name,
              to: user.email,
              subject: `Payment for plan ${plan.name}`,
              body: `Hello ${user.name}, your payment for plan ${plan.name} was successful`,
            }),
          },
        ],
      });
    },
  });
})();
