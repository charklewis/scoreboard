import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

const meta: MetaFunction = () => {
  return [{ title: "Scoreboard" }];
};

function Index() {
  return <Link to="login">Go to login</Link>;
}

export { meta };
export default Index;
