import { model, Schema } from 'mongoose';

const PaymentSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    plan_id: {
      type: String,
      required: true,
    },
    start_at: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expired_at: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = model('Payment', PaymentSchema);

export { Payment };
