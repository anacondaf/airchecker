import "../styles/navbar.style.css";
import avatar from "../assets/avatars/default.png";
import favicon from "../assets/favicon.png";

function Navbar() {
	return (
		<>
			<div className="navbar">
				<div className="logo_name">
					<img src={favicon} alt="logo.png" />
					<h4 className="app_name">airqual.tech</h4>
				</div>

				<div className="right_panel">
					<div className="avatar">
						<img src={avatar} />
					</div>
				</div>
			</div>
		</>
	);
}

export default Navbar;
