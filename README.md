# zenoh-fleet

Enter-to-accept CLI that writes **compatible Zenoh JSON5** for every machine on a robot fleet. Each box runs the same command, picks **hub** or **member**, and gets the files it should actually start — not a copy-and-tweak of Eclipse `DEFAULT_CONFIG.json5`.

```bash
npx @agenticros/zenoh-fleet          # wizard (default)
zenoh-fleet --help                   # routing + commands
zenoh-fleet --version
zenoh-fleet init --role member --yes
```

Apache-2.0. Node ≥ 20. No dependency on Corebrum or `@agenticros/core`.

## Routing

Hub (router)
: One `zenohd` on this machine. Listens on TCP 7447 (and WebSocket 10000 if AgenticROS is enabled). Other machines connect here. Default when no fleet exists yet. v1 writes `zenohd.json5`.

Member (client)
: A robot, Corebrum worker, or AgenticROS laptop. Does **not** run a second router. Connects to the hub (`zenoh-bridge-ros2dds`, `rmw_zenoh` session, or `corebrum --zenoh-router`). v1 writes client/bridge files.

Peer mesh
: Every node is a router and lists the others in `connect.endpoints`. No single hub. **Not generated in v1** (AgenticROS robots stay clients, not a second `zenohd`). Use `--role hub` or `--role member`. `--role peer` is an error.

Public LAN
: Multicast scouting on. Members on the same L2 can join without a hub IP.

Private mesh
: Multicast off. Members need the hub endpoint (`--join`, `--hub-ip`, or an ARC pull after the hub publishes).

## Defaults (hit Enter)

Name the fleet (or keep `local-fleet`) and press Enter through the rest:

- Isolation: public LAN
- Ports: `7447` / `10000`
- Integrations: AgenticROS + Corebrum + ROS 2 DDS bridge (rmw_zenoh off)
- Advertised IP: first non-loopback IPv4
- Role: hub if no fleet exists yet, otherwise member
- ARC: yes only if `agenticros login` already stored an API token

## Independent machines

```bash
# laptop / edge box
zenoh-fleet init --role hub --name warehouse-01 --yes

# robot (copy fleet.json, or pull from ARC)
zenoh-fleet init --role member --name warehouse-01 --join ./warehouse-01/fleet.json --yes
```

Hub output: `fleet.json`, `zenohd.json5`, `README.md`.

Member output (by integration): `fleet.json`, `zenoh-bridge-ros2dds-robot.json5`, optional `rmw-zenoh-session.json5`, `README.md`.

## AgenticROS Cloud (ARC)

Optional. If you are logged in (`agenticros login`), the hub can **PUT** its advertised `tcp/<lan-ip>:7447` and `ws://<lan-ip>:10000` to `https://cloud.agenticros.com/orgs/current/zenoh-fleet`. Members **GET** that record so they can Enter-through without copying IPs.

ARC does not discover LAN addresses and cannot punch NAT. Cross-site private meshes still need a VPN (Tailscale, etc.) or a public hub. Robots do not publish their own IPs in v1.

## Deploy notes

- Hub: `zenohd -c zenohd.json5`. Install `zenoh-plugin-remote-api` for AgenticROS.
- AgenticROS: `zenoh.routerEndpoint` = `ws://<hub>:10000` (never `tcp/...`).
- Corebrum: `corebrum daemon --zenoh-router tcp://<hub>:7447`.
- Robot: `zenoh-bridge-ros2dds -c zenoh-bridge-ros2dds-robot.json5`, then `nc -zv <hub> 7447`.

## License

Apache License 2.0.
