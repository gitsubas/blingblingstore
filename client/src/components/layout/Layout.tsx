import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartNotification } from "../ui/CartNotification";

export function Layout() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-r from-zinc-200 via-white to-zinc-200">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <Footer />
            <CartNotification />
        </div>
    );
}
