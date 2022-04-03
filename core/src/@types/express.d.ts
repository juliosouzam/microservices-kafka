declare namespace Express {
  import type { Producer } from 'kafkajs';

  export interface Request {
    producer: Producer;
  }
}
