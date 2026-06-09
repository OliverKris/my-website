import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";

import ProjectLayout from "./layouts/ProjectLayout";
import Formality from "./pages/projects/formality_analysis";

export default function App() {
    return (
        <>
            <Routes>
                <Route element={<RootLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/resume" element={<Resume />} />
                    <Route path="/contact" element={<Contact />} />                    
                </Route>

                <Route element={<ProjectLayout />}>
                    <Route path="/projects/formality" element={<Formality />} />
                </Route>
            </Routes>
            <Analytics />
        </>
    );
}
