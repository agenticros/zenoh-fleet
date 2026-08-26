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

export async function publishZenohFleet(
  token: string,
  record: ArcZenohFleet,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const res = await fetchImpl(`${arcBaseUrl()}/orgs/current/zenoh-fleet`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(record),
  });
  return res.ok;
}
