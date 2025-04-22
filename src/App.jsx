import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { PublicLayout } from "@/layouts/public-layout.jsx";
import AuthenticationLayout from "@/layouts/auth-layout.jsx";
import ProtectRoutes from "@/layouts/protected-routes.jsx";
import { MainLayout } from "@/layouts/main-layout.jsx";

import HomePage from "@/routes/home.jsx";
import { SignInPage } from "./routes/sign-in.jsx";
import { SignUpPage } from "./routes/sign-up.jsx";
import { Generate } from "./components/generate.jsx";
import { Dashboard } from "./routes/dashboard.jsx";
import { CreateEditPage } from "./routes/create-edit-page.jsx";
import { MockLoadPage } from "./routes/mock-load-page.jsx";
import { MockInterviewPage } from "./routes/mock-interview-page.jsx";
import { Feedback } from "./routes/feedback.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* public routes */}
                <Route element={<PublicLayout />}>
                    <Route index element={<HomePage />} />
                </Route>

                {/* authentication layout */}
                <Route element={<AuthenticationLayout />}>
                    <Route path="/signin/*" element={<SignInPage />} />
                    <Route path="/signup/*" element={<SignUpPage />} />
                </Route>

                {/* protected routes */}
                <Route
                    element={
                        <ProtectRoutes>
                            <MainLayout />
                        </ProtectRoutes>
                    }
                >
                    {/* add all the protect routes */}
                    <Route element={<Generate />} path="/generate">
                        <Route index element={<Dashboard />} />
                        <Route path=":interviewId" element={<CreateEditPage />} />
                        <Route path="interview/:interviewId" element={<MockLoadPage />} />
                        <Route
                            path="interview/:interviewId/start"
                            element={<MockInterviewPage />}
                        />
                        <Route path="feedback/:interviewId" element={<Feedback />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;