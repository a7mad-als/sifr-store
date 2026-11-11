import type { OrderInputPaymentMethod } from '@workspace/api-client-react';

/**
 * Payment adapter layer. Every method is currently DEMO: no card data is ever collected
 * in this frontend and nothing is charged. To integrate a real provider, replace
 * `authorize` for that method with a redirect/hosted-page flow (KNET, MyFatoorah, Stripe Checkout).
 * Card data must always be entered on the provider's hosted page, never here.
 */
export type PaymentMethod = OrderInputPaymentMethod;

export interface PaymentAdapter {
  id: PaymentMethod;
  labelKey: 'pm.knet' | 'pm.card' | 'pm.myfatoorah' | 'pm.stripe';
  descKey: 'pm.knetD' | 'pm.cardD' | 'pm.myfatoorahD' | 'pm.stripeD';
  mark: string;
  demo: boolean;
  authorize: (ctx: { orderNumber: string; total: number }) => Promise<{ status: 'demo-approved' }>;
}

const demoAuthorize: PaymentAdapter['authorize'] = async () => ({ status: 'demo-approved' });

export const paymentAdapters: PaymentAdapter[] = [
  { id: 'knet', labelKey: 'pm.knet', descKey: 'pm.knetD', mark: 'K', demo: true, authorize: demoAuthorize },
  { id: 'card', labelKey: 'pm.card', descKey: 'pm.cardD', mark: 'V/M', demo: true, authorize: demoAuthorize },
  { id: 'myfatoorah', labelKey: 'pm.myfatoorah', descKey: 'pm.myfatoorahD', mark: 'MF', demo: true, authorize: demoAuthorize },
  { id: 'stripe', labelKey: 'pm.stripe', descKey: 'pm.stripeD', mark: 'S', demo: true, authorize: demoAuthorize },
];

export function getAdapter(id: PaymentMethod) {
  return paymentAdapters.find((a) => a.id === id) ?? paymentAdapters[0];
}

/** Demo shipping estimates, mirrored for display only. Server is authoritative. */
export const demoShipping = (country: string) => (country === 'KW' ? 2 : 5);
