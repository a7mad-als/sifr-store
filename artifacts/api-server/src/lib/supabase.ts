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
