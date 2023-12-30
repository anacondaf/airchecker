import { useState } from "react";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useLocation, Link } from "react-router-dom";

import DashboardRoundedIcon from "@mui/icons-material/Dashboard";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";

import { Typography } from "../Typography/Typography";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";

import {
	StyledCollapsedSidebarHeader,
	StyledLogo,
	StyledSidebarHeader,
} from "./SidebarHeader";

const themes = {
	light: {
		sidebar: {
			backgroundColor: "#ffffff",
			color: "#607489",
		},
		menu: {
			menuContent: "#fbfcfd",
			icon: "#0098e5",
			hover: {
				backgroundColor: "#c5e4ff",
				color: "#44596e",
			},
			disabled: {
				color: "#9fb6cf",
			},
		},
	},
	dark: {
		sidebar: {
			backgroundColor: "#0b29488c",
			color: "#8ba1b7",
		},
		menu: {
			menuContent: "#082440",
			icon: "#59d0ff",
			hover: {
				backgroundColor: "#00458b",
				color: "#b6c8d9",
			},
			disabled: {
				color: "#3e5e7e",
			},
		},
	},
};

// hex to rgba converter
const hexToRgba = (hex, alpha) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const menuClasses = {
	root: "ps-menu-root",
	menuItemRoot: "ps-menuitem-root",
	subMenuRoot: "ps-submenu-root",
	button: "ps-menu-button",
	prefix: "ps-menu-prefix",
	suffix: "ps-menu-suffix",
	label: "ps-menu-label",
	icon: "ps-menu-icon",
	subMenuContent: "ps-submenu-content",
	SubMenuExpandIcon: "ps-submenu-expand-icon",
	disabled: "ps-disabled",
	active: "ps-active",
	open: "ps-open",
};

export function SideBar() {
	const location = useLocation();

	const [theme, setTheme] = useState("dark");
	const [hasImage, setHasImage] = useState(true);
	const [collapsed, setCollapsed] = useState(false);

	function handleCollapse(event) {
		setCollapsed(!collapsed);
	}

	const SidebarHeader = ({ children, collapsed, GoSidebarIcon, ...rest }) => {
		return collapsed ? (
			<StyledCollapsedSidebarHeader target="_blank">
				<GoSidebarCollapse
					style={{ cursor: "pointer" }}
					onClick={handleCollapse}
				/>
			</StyledCollapsedSidebarHeader>
		) : (
			<StyledSidebarHeader {...rest}>
				<div style={{ display: "flex", alignItems: "center" }}>
					<div style={{ display: "flex", alignItems: "center", flex: "50%" }}>
						<StyledLogo>A</StyledLogo>
						<Typography variant="subtitle1" fontWeight={700} color="#0098e5">
							AirQual
						</Typography>
					</div>

					<GoSidebarExpand
						style={{ cursor: "pointer" }}
						onClick={handleCollapse}
					/>
				</div>
			</StyledSidebarHeader>
		);
	};

	const menuItemStyles = {
		root: {
			fontSize: "15px",
			fontWeight: 200,
		},
		icon: {
			color: themes[theme].menu.icon,
			[`&.${menuClasses.disabled}`]: {
				color: themes[theme].menu.disabled.color,
			},
		},
		SubMenuExpandIcon: {
			color: "#b6b7b9",
		},
		subMenuContent: ({ level }) => ({
			backgroundColor:
				level === 0
					? hexToRgba(
							themes[theme].menu.menuContent,
							hasImage && !collapsed ? 0.4 : 1
					  )
					: "transparent",
		}),
		button: {
			[`&.${menuClasses.disabled}`]: {
				color: themes[theme].menu.disabled.color,
			},
			"&:hover": {
				backgroundColor: hexToRgba(
					themes[theme].menu.hover.backgroundColor,
					hasImage ? 0.8 : 1
				),
				color: themes[theme].menu.hover.color,
			},
		},
		label: ({ open }) => ({
			fontWeight: open ? 600 : undefined,
		}),
	};

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<Sidebar
				collapsed={collapsed}
				className="app"
				backgroundColor={hexToRgba(
					themes[theme].sidebar.backgroundColor,
					hasImage ? 0.9 : 1
				)}
				rootStyles={{
					color: themes[theme].sidebar.color,
				}}
				image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
			>
				<SidebarHeader
					style={{ marginBottom: "24px", marginTop: "16px" }}
					collapsed={collapsed}
				/>

				<Menu style={{ paddingTop: "8px" }} menuItemStyles={menuItemStyles}>
					<MenuItem
						component={<Link to="dashboard" className="link" />}
						icon={<DashboardRoundedIcon />}
					>
						Dashboard
					</MenuItem>

					<MenuItem icon={<AnalyticsRoundedIcon />}>Analystics</MenuItem>

					{/* <SubMenu label="Charts" icon={<BarChartRoundedIcon />}>
						<MenuItem icon={<TimelineRoundedIcon />}> Timeline Chart </MenuItem>
						<MenuItem icon={<BubbleChartRoundedIcon />}>Bubble Chart</MenuItem>
					</SubMenu> */}

					{/* <SubMenu label="Wallets" icon={<WalletRoundedIcon />}>
						<MenuItem icon={<AccountBalanceRoundedIcon />}>
							Current Wallet
						</MenuItem>
						<MenuItem icon={<SavingsRoundedIcon />}>Savings Wallet</MenuItem>
					</SubMenu> */}

					<MenuItem
						component={<Link to="settings" className="link" />}
						icon={<SettingsApplicationsRoundedIcon />}
					>
						Settings
					</MenuItem>
				</Menu>
			</Sidebar>
		</div>
	);
}
