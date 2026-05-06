import type { LoaderFunctionArgs } from "react-router";
import { Outlet } from "react-router";
import { requireUser } from "~/utils/auth.server";
import type { Route } from "../../+types/root";
import { userContext } from "~/context";

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }: { request: Request; context: any }) => {
    const user = await requireUser(request);
    context.set(userContext, user);
};

export const middleware = [authMiddleware];

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUser(request);
    return { user };
}

export default function AppLayout() {
    return (
        <div>
            <Outlet />
        </div>
    );
}