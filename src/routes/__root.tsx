import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Fragment } from "react/jsx-runtime";
import Header from "@/components/Header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Fragment>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </Fragment>
  );
}
