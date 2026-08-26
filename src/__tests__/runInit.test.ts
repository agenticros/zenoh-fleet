import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { runInit } from "../wizard.js";

describe("runInit --yes", () => {
  it("writes hub files without calling ARC", async () => {
    const out = mkdtempSync(join(tmpdir(), "zenoh-fleet-out-"));
    const plan = await runInit(
      {
        yes: true,
        role: "hub",
        name: "lab",
        hubIp: "192.168.10.4",
        out,
        arc: false,
      },
      { token: undefined },
    );
    assert.equal(plan.input.role, "hub");
    const zenohd = readFileSync(join(out, "zenohd.json5"), "utf8");
    assert.match(zenohd, /mode: "router"/);
    const fleet = JSON.parse(readFileSync(join(out, "fleet.json"), "utf8"));
    assert.deepEqual(fleet.hubEndpoints, ["tcp/192.168.10.4:7447"]);
    assert.match(readFileSync(join(out, "README.md"), "utf8"), /zenohd -c zenohd\.json5/);
  });
});
