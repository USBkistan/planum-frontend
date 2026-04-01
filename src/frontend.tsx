import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { App } from "./App";
import { AuthProvider, AuthGuard } from "./components/auth/AuthProvider";
import "./index.css";

const elem = document.getElementById("root")!;
const app = (
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<AuthGuard><App /></AuthGuard>} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);

if (import.meta.hot) {
    const root = (import.meta.hot.data.root ??= createRoot(elem));
    root.render(app);
} else {
    createRoot(elem).render(app);
}
