import Stripe from 'stripe';

export interface ChargeOptions {
  amount: number;
  token: string;
}

const chargeCreator = new Stripe(process.env.STRIPE_KEY || '', {
  apiVersion: '2022-11-15',
});

export async function createCharge(options: ChargeOptions) {
  return chargeCreator.charges.create({
    currency: 'usd',
    amount: options.amount * 100,
    source: options.token,
  });
}
