import type { LoaderFunctionArgs } from "react-router";
import { Outlet } from "react-router";
import { requireUser } from "~/utils/auth.server";

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