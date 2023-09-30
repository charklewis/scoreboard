import {
  type ActionFunctionArgs,
  type LinksFunction,
  json,
} from "@remix-run/node";
import stylesheet from "~/tailwind.css";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { db } from "./database/db";

const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

async function action({ request }: ActionFunctionArgs) {
  const users = await db.query.user.findFirst();
  console.log({ users });
  const body = await request.formData();
  const email = body.get("email");
  console.log(email);
  return json({});
}

function App() {
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export { links, action };
export default App;
