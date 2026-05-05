import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"),
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),
    route("logout", "routes/logout.tsx"),
    route("profile", "routes/profile.tsx"),
    route("todos", "routes/todos.tsx"),
    route("todos/new", "routes/todos.new.tsx"),
    route("todos/:taskId", "routes/todos.$taskId.tsx"),
    route("todos/:taskId/edit", "routes/todos.$taskId.edit.tsx"),
    route("todos/:taskId/toggle", "routes/todos.$taskId.toggle.tsx"),
    route("todos/:taskId/delete", "routes/todos.$taskId.delete.tsx"),
] satisfies RouteConfig;
