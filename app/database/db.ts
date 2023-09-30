import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";

import fetchPolyfill from "fetch-ponyfill";

const connection = connect({
  url: process.env["DATABASE_URL"] as string,
  fetch: fetchPolyfill().fetch,
});

const db = drizzle(connection, { schema });

export { db };
