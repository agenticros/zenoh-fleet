import type { ArcZenohFleet } from "./types.js";

export const DEFAULT_ARC_URL = "https://cloud.agenticros.com";

export function arcBaseUrl(): string {
  return (
    process.env.ZENOH_FLEET_ARC_URL ||
    process.env.AGENTICROS_CLOUD ||
    DEFAULT_ARC_URL
  ).replace(/\/$/, "");
}

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    api_token: token,
    "Content-Type": "application/json",
  };
}

export async function pullZenohFleet(
  token: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ArcZenohFleet | null> {
  const res = await fetchImpl(`${arcBaseUrl()}/orgs/current/zenoh-fleet`, {
    headers: headers(token),
  });
  if (res.status === 404 || res.status === 401) return null;
  if (!res.ok) return null;
  const body = (await res.json()) as ArcZenohFleet | null;
  if (!body || typeof body !== "object" || !body.name) return null;
  return body;
}

export interface ArcPublishResult {
  ok: boolean;
  status: number;
  detail: string;
}

export function formatArcPublishFailure(status: number, body: string): string {
  if (status === 404 || /Cannot PUT/i.test(body)) {
    return "ARC does not expose PUT /orgs/current/zenoh-fleet yet (cloud returned 404). Configs still work locally — copy fleet.json or pass --join / --hub-ip on other machines until that API is deployed.";
  }
  if (status === 401) {
    return "ARC rejected the API token. Run `npx agenticros login` again.";
  }
  if (/Not in an organization/i.test(body)) {
    return "This login is not in an organization. Create or join an org on https://cloud.agenticros.com, then retry.";
  }
  const snippet = body.replace(/\s+/g, " ").trim().slice(0, 200);
  return `ARC publish failed (HTTP ${status})${snippet ? `: ${snippet}` : ""}.`;
}

export async function publishZenohFleet(
  token: string,
  record: ArcZenohFleet,
  fetchImpl: typeof fetch = fetch,
): Promise<ArcPublishResult> {
  const res = await fetchImpl(`${arcBaseUrl()}/orgs/current/zenoh-fleet`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(record),
  });
  const detail = await res.text();
  if (res.ok) {
    return { ok: true, status: res.status, detail };
  }
  return {
    ok: false,
    status: res.status,
    detail: formatArcPublishFailure(res.status, detail),
  };
}
