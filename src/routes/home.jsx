import { Sparkles } from "lucide-react";
import "./home.css";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Main content */}
            <section className="hero flex-grow flex items-center justify-center">
                <div className="hero__column">
                    <h1 className="h1 hero__heading">
                        <span className="hero__heading-gradient">Intelligent</span>
                        cloud-based{" "}
                        <span className="hero__heading-gradient">note-taking</span>
                        and collaboration tool
                    </h1>
                    <Link to={"/generate"} className="w-full">
                        <Button className="w-3/4">
                            Generate <Sparkles className="ml-2" />
                        </Button>
                    </Link>
                </div>
                <div className="hero__column">
                    <img
                        className="hero__graphic w-[500px] h-[500px] "
                        src="src/routes/abstract-shapes.png"
                        alt="abstract shapes"
                    />
                </div>
            </section>

            {/* Footer Section */}
            <footer className="w-full text-center py-4 bg-gray-900 text-white">
                © {new Date().getFullYear()} Intervue. All Rights Reserved.
            </footer>
        </div>
    );
};

export default HomePage;