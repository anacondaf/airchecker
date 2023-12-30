import "../styles/root.style.css";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "../components/Navbar";
import { SideBar } from "../components/Sidebar/Sidebar";

import { Navigate } from "react-router-dom";

function Root() {
	return (
		<div className="root_page">
			<SideBar />
			<div className="page_content">
				<Navbar />

				<div id="detail">
					<Outlet />
				</div>
			</div>
			<ToastContainer
				position="top-right"
				newestOnTop={false}
				theme="light"
				rtl={false}
				pauseOnFocusLoss
				autoClose={5000}
			/>

			<Navigate to="/dashboard" replace={true} />
		</div>
	);
}

export default Root;
