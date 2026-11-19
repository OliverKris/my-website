import { Outlet } from "react-router-dom";
import Nav from "../components/site/Nav";

/** Case studies with their own full-bleed design keep the site's navigation on top. */
export default function ProjectLayout() {
    return (
        <div className="relative">
            <Nav />
            <Outlet />
        </div>
    );
}
