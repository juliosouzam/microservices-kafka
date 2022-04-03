import { Request, Response } from 'express';

import { Plan } from '../../schemas/Plan';
import { User } from '../../schemas/User';

export class PaymentController {
  async store(request: Request, response: Response): Promise<Response> {
    const { user_id, plan_id } = request.body;

    const user = await User.findById(user_id);
    if (!user) {
      return response.status(400).json({ error: 'User not found' });
    }

    const plan = await Plan.findById(plan_id);
    if (!plan) {
      return response.status(400).json({ error: 'Plan not found' });
    }

    const producer = request.producer;

    await producer.send({
      topic: 'payment-creating',
      messages: [
        {
          value: JSON.stringify({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            plan: {
              id: plan.id,
              name: plan.name,
              price: plan.price,
              duration: plan.duration,
            },
          }),
        },
      ],
    });

    return response.json();
  }
}
