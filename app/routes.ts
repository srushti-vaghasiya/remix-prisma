import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/_app._index.tsx"),
    route("login", "routes/_auth.login.tsx"),
    route("signup", "routes/_auth.signup.tsx"),
    route("logout", "routes/logout.tsx"),
    route("profile", "routes/_app.profile.tsx"),
    route("todos", "routes/_app.todos.tsx"),
    route("todos/new", "routes/_app.todos.new.tsx"),
    route("todos/:taskId", "routes/_app.todos.$taskId.tsx"),
    route("todos/:taskId/edit", "routes/_app.todos.$taskId.edit.tsx"),
    route("todos/:taskId/toggle", "routes/_app.todos.$taskId.toggle.tsx"),
    route("todos/:taskId/delete", "routes/_app.todos.$taskId.delete.tsx"),
] satisfies RouteConfig;
