import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

requestAnimationFrame(() => {
    document.documentElement.classList.remove("no-theme-transition");
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <div className="theme-transition">
                <App />
            </div>
        </BrowserRouter>
    </React.StrictMode>
);
