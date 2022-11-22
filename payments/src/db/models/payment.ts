import mongoose from 'mongoose';

export interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(paymentAttrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  },
});

paymentSchema.statics.build = (paymentAttrs: PaymentAttrs) => {
  return new Payment(paymentAttrs);
};

export const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);
