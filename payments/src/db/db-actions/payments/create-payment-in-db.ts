import { Payment, PaymentAttrs } from '../../models/payment';

export async function createPaymentInDb(paymentAttrs: PaymentAttrs) {
  const payment = Payment.build(paymentAttrs);

  await payment.save();
  return payment;
}
