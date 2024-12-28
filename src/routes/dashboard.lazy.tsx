import { createLazyFileRoute } from "@tanstack/react-router";
export const Route = createLazyFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { auth } = useAuth();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!auth) {
  //     navigate({ to: "/sign-in" });
  //   }
  // }, [auth, navigate]);

  return <div>Hello "/dashboard"!</div>;
}
