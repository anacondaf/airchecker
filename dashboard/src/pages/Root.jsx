import { useState } from "react";
import "../styles/root.style.css";

import Navbar from "../components/Navbar";
import MainMenu from "../components/MainMenu";

import { Outlet } from "react-router-dom";

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
		</div>
	);
}

export default Root;
