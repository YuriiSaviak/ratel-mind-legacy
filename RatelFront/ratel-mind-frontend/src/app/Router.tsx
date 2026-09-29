import {createBrowserRouter} from "react-router-dom";
import Layout from "../layout/Layout.tsx";
import HomePage from "../pages/HomePage.tsx";
import TestPage from "../pages/test/TestPage.tsx";
import TestResultPage from "../pages/test/TestResultPage.tsx";
import TestLevelsGuidePage from "../pages/test/TestLevelsGuidePage.tsx";
import TestAiInsightsPage from "../pages/test/TestAiInsightsPage.tsx";
import AboutPage from "../pages/AboutPage.tsx";
import WorkshopsPage from "../pages/WorkshopsPage.tsx";
import ContactPage from "../pages/ContactPage.tsx";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage.tsx";
import CookiePolicyPage from "../pages/CookiePolicyPage.tsx";
import TermsPage from "../pages/TermsPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: "test",
                element: <TestPage/>
            },
            {
                path: "test/result",
                element: <TestResultPage/>
            },
            {
                path: "test/levels",
                element: <TestLevelsGuidePage/>
            },
            {
                path: "test/ai",
                element: <TestAiInsightsPage/>
            },
            {
                path: "about",
                element: <AboutPage/>
            },
            {
                path: "workshops",
                element: <WorkshopsPage/>
            },
            {
                path: "contact",
                element: <ContactPage/>
            },
            {
                path: "privacy-policy",
                element: <PrivacyPolicyPage/>
            },
            {
                path: "cookie-policy",
                element: <CookiePolicyPage/>
            },
            {
                path: "terms-and-conditions",
                element: <TermsPage/>
            },
            {
                path: "privacy",
                element: <PrivacyPolicyPage/>
            },
            {
                path: "cookies",
                element: <CookiePolicyPage/>
            },
            {
                path: "terms",
                element: <TermsPage/>
            },
            {
                path: "*",
                element: <NotFoundPage/>
            }
        ]
    }
]);

export const AppRoutes = () => router;
