import { Router } from 'express';

// import { LoginController } from './app/controllers/LoginController';
import { RegisterController } from './app/controllers/RegisterController';
import { PlanController } from './app/controllers/PlanController';
import { PaymentController } from './app/controllers/PaymentController';

const routes = Router();

routes.get('/', (_request, response) => {
  return response.json({ message: 'Running' });
});

// routes.post('/login', new LoginController().store);
routes.post('/register', new RegisterController().store);
routes.get('/plans', new PlanController().index);
routes.post('/plans', new PlanController().store);

routes.post('/payments', new PaymentController().store);

export { routes };
