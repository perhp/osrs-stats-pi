import { serve } from "bun";
import buildRoutes from "./routes";

const server = serve({
  routes: buildRoutes(),
  development: process.env.NODE_ENV !== "production",
  port: process.env.PORT ?? 3000,
});

console.log(`🚀  Listening on ${server.url}`);
