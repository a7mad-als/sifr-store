import { randomUUID } from "node:crypto";

// Replace this adapter with hosted payment redirects when real gateways are connected.
// Never accept raw card numbers, security codes, or banking credentials here.
export interface PaymentAdapter {
  confirm(method: string): Promise<{ orderNumber: string; demo: boolean }>;
}
export const demoPaymentAdapter: PaymentAdapter = {
  async confirm(_method) {
    return { orderNumber: `SIFR-${randomUUID().slice(0, 8).toUpperCase()}`, demo: true };
  },
};
