/** Routing copy shared by `--help` and README. Keep these strings in sync. */

export const ROUTING_HELP = `
Routing
  Hub (router)
    One zenohd on this machine. Listens on TCP 7447 (and WebSocket 10000 if
    AgenticROS is enabled). Other machines connect here. Default when no fleet
    exists yet. v1 writes zenohd.json5.

  Member (client)
    A robot, Corebrum worker, or AgenticROS laptop. Does not run a second
    router. Connects to the hub (zenoh-bridge-ros2dds, rmw_zenoh session, or
    corebrum --zenoh-router). v1 writes client/bridge files.

  Peer mesh
    Every node is a router and lists the others in connect.endpoints. No single
    hub. Not generated in v1 (AgenticROS robots stay clients, not a second
    zenohd). Use --role hub or --role member. --role peer is an error.

  Public LAN
    Multicast scouting on. Members on the same L2 can join without a hub IP.

  Private mesh
    Multicast off. Members need the hub endpoint (--join, --hub-ip, or an ARC
    pull after the hub publishes).
`.trim();

export const INIT_ROLE_HELP =
  "This machine's role: hub (router) or member (client). Peer mesh is not generated yet.";

export const PEER_ROLE_ERROR =
  "use hub or member; peer mesh is not generated yet.";
