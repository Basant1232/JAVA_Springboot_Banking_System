import {Outlet} from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout(){

    return (

        <div>
            <Navbar/>

            <div className="layout">
                <Sidebar/>

                <main className="main-content">
                    <Outlet/>
                </main>

            </div>

        </div>
    );
}

export default MainLayout;