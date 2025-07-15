import statsRoutes from "./api/get-stats";
import staticRoutes from "./static";

export default () => ({
  ...staticRoutes,
  ...statsRoutes,
});
