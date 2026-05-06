import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"),
    route("logout", "routes/logout.tsx"),
    route("*", "routes/[...404].tsx"),

    // Public routes
    layout("routes/_auth/_layout.tsx", [
        route("login", "routes/_auth/login.tsx"),
        route("signup", "routes/_auth/signup.tsx"),
    ]),

    // Protected routes
    layout("routes/_app/_layout.tsx", [
        route("profile", "routes/_app/profile.tsx"),

        ...prefix("todos", [
            index("routes/_app/todos/_index.tsx"),
            route("new", "routes/_app/todos/new.tsx"),

            ...prefix(":taskId", [
                index("routes/_app/todos/$taskId/_index.tsx"),
                route("edit", "routes/_app/todos/$taskId/edit.tsx"),
                route("toggle", "routes/_app/todos/$taskId/toggle.tsx"),
                route("delete", "routes/_app/todos/$taskId/delete.tsx"),
            ]),
        ]),
    ]),
] satisfies RouteConfig;