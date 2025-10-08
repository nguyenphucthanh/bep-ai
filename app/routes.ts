import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/auth.tsx", { id: "auth" }, [
    layout("routes/app-shell.tsx", { id: "app-shell" }, [
      index("routes/home.tsx", { id: "home" }),
      route(":date", "routes/$date.tsx", { id: "date" }, [
        index("routes/$date.index.tsx", { id: "date.index" }),
        route("chat", "routes/$date.chat.tsx", {
          id: "date.chat",
        }),
      ]),
    ]),
    route("login", "routes/login.tsx"),
    route("logout", "routes/logout.tsx"),
  ]),
] satisfies RouteConfig;
