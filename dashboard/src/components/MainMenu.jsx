import "../styles/main_menu.style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faDownload, faGear } from "@fortawesome/free-solid-svg-icons";
import {
	StyledMainMenuItemText,
	StyledMainMenuText,
} from "../style_components/StyledText";

function MainMenu() {
	return (
		<div className="main_menu">
			<StyledMainMenuText>Main Menu</StyledMainMenuText>

			<div className="main_menu_container">
				<div className="menu_item active">
					<FontAwesomeIcon icon={faHouse} />
					<StyledMainMenuItemText>Dashboard</StyledMainMenuItemText>
				</div>

				<div className="menu_item">
					<FontAwesomeIcon icon={faDownload} />
					<StyledMainMenuItemText>Download reports</StyledMainMenuItemText>
				</div>

				<div className="menu_item">
					<FontAwesomeIcon icon={faGear} />
					<StyledMainMenuItemText>Settings</StyledMainMenuItemText>
				</div>
			</div>
		</div>
	);
}

export default MainMenu;
