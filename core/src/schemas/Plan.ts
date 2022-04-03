import { model, Schema } from 'mongoose';

const PlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = model('Plan', PlanSchema);

export { Plan };
