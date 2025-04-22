import { MainRoutes } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

export const NavigationRoutes = ({
    isMobile = false,
}) => {
    return (
        <ul
            className={cn(
                "flex items-center gap-6",
                isMobile && "items-start flex-col gap-8"
            )}
        >
            {MainRoutes.map((route) => (
                <NavLink
                    key={route.href}
                    to={route.href}
                    className={({ isActive }) =>
                        cn(
                            "text-lg font-bold text-white font-[Times_New_Roman]",
                            isActive && "text-neutral-900"
                        )
                    }
                >
                    {route.label}
                </NavLink>
            ))}
        </ul>
    );
};