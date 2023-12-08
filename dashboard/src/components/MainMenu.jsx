import { useState } from 'react';
import "../styles/main_menu.style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faDownload, faGear } from "@fortawesome/free-solid-svg-icons";
import {
	StyledMainMenuItemText,
	StyledMainMenuText,
} from "../style_components/StyledText";
import { Link } from "react-router-dom";

function MainMenu() {

	const handleChangeMenuItem = (e) => {
        const menuItems = document.querySelectorAll(".main_menu .main_menu_container a .menu_item");
        
        menuItems.forEach(item => item.classList.remove("active"));
        e.currentTarget.children[0].classList.add("active");
    }

	return (
		<div className="main_menu">
			<StyledMainMenuText>Main Menu</StyledMainMenuText>

			<div className="main_menu_container">
				<Link to="/dashboard" style={{ width: "100%" }} onClick={(e) => handleChangeMenuItem(e)}>
					<div className="menu_item active">
						<FontAwesomeIcon icon={faHouse} />
						<StyledMainMenuItemText>Dashboard</StyledMainMenuItemText>
					</div>
				</Link>

				<Link to="/settings" style={{ width: "100%" }} onClick={(e) => handleChangeMenuItem(e)}>
					<div className="menu_item">
						<FontAwesomeIcon icon={faGear} />
						<StyledMainMenuItemText>Settings</StyledMainMenuItemText>
					</div>
				</Link>
			</div>
		</div>
	);
}

export default MainMenu;
