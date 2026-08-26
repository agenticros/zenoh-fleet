import type { FleetIdentity } from "../types.js";

export function renderFleetJson(identity: FleetIdentity): string {
  return `${JSON.stringify(
    {
      name: identity.name,
      isolation: identity.isolation,
      tcpPort: identity.tcpPort,
      wsPort: identity.wsPort,
      hubEndpoints: identity.hubEndpoints,
      wsEndpoint: identity.wsEndpoint,
    },
    null,
    2,
  )}\n`;
}
