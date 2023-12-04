import "../styles/main_menu.style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faDownload, faGear } from "@fortawesome/free-solid-svg-icons";
import {
	StyledMainMenuItemText,
	StyledMainMenuText,
} from "../style_components/StyledText";
import { Link } from "react-router-dom";

function MainMenu() {
	return (
		<div className="main_menu">
			<StyledMainMenuText>Main Menu</StyledMainMenuText>

			<div className="main_menu_container">
				<Link to="/dashboard">
					<div className="menu_item active">
						<FontAwesomeIcon icon={faHouse} />
						<StyledMainMenuItemText>Dashboard</StyledMainMenuItemText>
					</div>
				</Link>
			</div>
		</div>
	);
}

export default MainMenu;
