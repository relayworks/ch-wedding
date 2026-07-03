import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allows the dev server to be reached (and its JS/CSS hot-reload assets
  // requested without a 403) from other devices on the same local network,
  // e.g. testing on a phone via http://<this-machine's-LAN-IP>:3000.
  // Update/add entries here if your machine's LAN IP changes.
  allowedDevOrigins: ["172.30.1.51"],
};

export default nextConfig;
