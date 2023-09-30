import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";

//note this is needed for vercel, otherwise all queries error with
//First parameter has member 'readable' that is not a ReadableStream
import fetch from "cross-fetch";

const connection = connect({
  url: process.env["DATABASE_URL"] as string,
  fetch,
});

const db = drizzle(connection, { schema });

export { db };
