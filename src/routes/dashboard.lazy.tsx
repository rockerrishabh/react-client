import { useAuth } from "@/hooks/useAuth";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth) {
      navigate({ to: "/sign-in" });
    }
  }, [auth, navigate]);

  return <div>Hello "/dashboard"!</div>;
}
