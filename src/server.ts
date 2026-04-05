import "dotenv/config";
import app from "./app";
import { environmentConfiguration } from "./config/env";

app.listen(environmentConfiguration.port, () => {
  console.log(
    `Server is running on port ${environmentConfiguration.port} in ${environmentConfiguration.nodeEnvironment} mode.`,
  );
});