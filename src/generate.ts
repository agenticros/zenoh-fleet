import type { GenerateInput } from "./types.js";
import { renderBridge } from "./templates/bridge.js";
import { renderFleetJson } from "./templates/fleetJson.js";
import { renderRmwSession } from "./templates/rmwSession.js";
import { renderZenohd } from "./templates/zenohd.js";
import { renderDeployReadme } from "./printDeploy.js";

export function generateFiles(input: GenerateInput): Record<string, string> {
  const files: Record<string, string> = {
    "fleet.json": renderFleetJson(input.identity),
    "README.md": renderDeployReadme(input),
  };

  if (input.role === "hub") {
    files["zenohd.json5"] = renderZenohd(input);
    return files;
  }

  if (input.integrations.ros2ddsBridge) {
    files["zenoh-bridge-ros2dds-robot.json5"] = renderBridge(input);
  }
  if (input.integrations.rmwZenoh) {
    files["rmw-zenoh-session.json5"] = renderRmwSession(input);
  }
  return files;
}
