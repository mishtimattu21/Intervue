import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { Container } from "./container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";
import { NavLink } from "react-router-dom";
import { ProfileContainer } from "./profile-container";
import { ToggleContainer } from "./toggle-container";

const Header = () => {
    const { userId } = useAuth();

    return (
        <header className="w-full border-b duration-150 transition-all ease-in-out bg-[rgba(1,115,115,1)] text-white">
            <Container>
                <div className="flex items-center gap-4 w-full">
                    {/* logo section */}
                    <LogoContainer />

                    {/* navigation section */}
                    <nav className="hidden md:flex items-center gap-3">
                        <NavigationRoutes />
                        {userId && (
                            <NavLink
                                to={"/generate"}
                                className={({ isActive }) =>
                                    cn(
                                        "text-lg font-bold text-white font-[Times_New_Roman]",
                                        isActive && "font-semibold"
                                    )
                                }
                            >
                                <b>Take An Interview</b>
                            </NavLink>
                        )}
                    </nav>

                    <div className="ml-auto flex items-center gap-6 ">
                        {/* profile section */}
                        <ProfileContainer />

                        {/* mobile toggle section */}
                        <ToggleContainer />
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Header;