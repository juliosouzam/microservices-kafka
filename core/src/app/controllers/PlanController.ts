import { Request, Response } from 'express';

import { Plan } from '../../schemas/Plan';

export class PlanController {
  async index(request: Request, response: Response): Promise<Response> {
    const plans = await Plan.find();

    return response.json(plans);
  }

  async store(request: Request, response: Response): Promise<Response> {
    const { name, description, duration, price } = request.body;

    const plan = await Plan.create({
      name,
      description,
      duration,
      price,
    });

    return response.json(plan);
  }
}
