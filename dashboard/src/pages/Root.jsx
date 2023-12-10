import "../styles/root.style.css";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Navbar from "../components/Navbar";
import MainMenu from "../components/MainMenu";

function Root() {
	return (
		<div className="root_page">
			<Navbar />

			<div className="page_content">
				<MainMenu />

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
		</div>
	);
}

export default Root;
