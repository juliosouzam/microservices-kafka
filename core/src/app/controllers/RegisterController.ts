import { Request, Response } from 'express';
import { hash } from 'bcryptjs';

import { User } from '../../schemas/User';

export class RegisterController {
  async store(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return response.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password: await hash(password, 10),
    });

    const producer = request.producer;

    await producer.send({
      topic: 'email-notification',
      messages: [
        {
          value: JSON.stringify({
            name,
            to: email,
            subject: 'Welcome to the app',
            body: `Hi ${name}, welcome to the app!`,
          }),
        },
      ],
    });

    return response.json(user);
  }
}
