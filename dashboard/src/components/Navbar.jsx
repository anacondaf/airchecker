import "../styles/navbar.style.css";
import avatar from "../assets/avatars/default.png";

import { Input } from "semantic-ui-react";

function Navbar() {
	return (
		<>
			<div className="navbar">
				<div className="avatar">
					<img src={avatar} />
				</div>

				<Input icon="search" placeholder="Search..." />
			</div>
		</>
	);
}

export default Navbar;
