type SifrRequestKind = "demo_order" | "partnership" | "newsletter";

type SifrRequest = {
  id: string;
  kind: SifrRequestKind;
  payload: object;
};

export async function saveSifrRequest(request: SifrRequest): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Supabase connection is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/sifr_requests`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify(request),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Supabase rejected the request with status ${response.status}.`);
  }
}

export type OrderRow = {
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  payment_method: string;
  payment_status: "paid";
  items: { bookId: number; title: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: "KWD";
  demo: boolean;
};

// Saves a paid order into the `orders` table (see supabase/orders.sql).
export async function saveOrder(order: OrderRow): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Supabase connection is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/orders`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify(order),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase rejected the order with status ${response.status}: ${detail.slice(0, 300)}`);
  }
}
