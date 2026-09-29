import Header from "./Header.tsx";
import {Outlet} from "react-router-dom";
import Footer from "./Footer.tsx";
import {ReactElement} from "react";
import CookieConsent from "./CookieConsent.tsx";
import ScrollToTop from "./ScrollToTop.tsx";

export default function Layout(): ReactElement {
    return (
        <>
            <ScrollToTop/>
            <Header/>
            <div className="app">
                <main className="main">
                    <div className="container">
                        <Outlet/>
                    </div>
                </main>
            </div>
            <Footer/>
            <CookieConsent/>
        </>
    )
}
