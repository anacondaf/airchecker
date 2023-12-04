import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "../styles/dashboard.style.css";

import Navbar from "../components/Navbar";
import MainMenu from "../components/MainMenu";

function Dashboard() {
	const [count, setCount] = useState(0);

	return (
		<div className="dashboard_page">
			<Navbar />

			<div className="page_content">
				<MainMenu />
			</div>
		</div>
	);
}

export default Dashboard;
