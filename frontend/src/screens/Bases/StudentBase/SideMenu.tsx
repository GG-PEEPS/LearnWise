import React from "react";
import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { NavLink } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import { Box } from "@mui/system";
import { GlobalStyles, useTheme } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const drawerWidth = 240;

const listItems = [
	{
		key: "dashboard",
		to: "/dashboard",
		name: "Dashboard",
		icon: <DashboardIcon />,
	},
	{
		key: "assignments",
		to: "/assignments",
		name: "Assignments",
		icon: <AssignmentTurnedInIcon />,
	},
	{
		key: "Subjects",
		to: "/subjects",
		name: "Subjects",
		icon: <CollectionsBookmarkIcon />,
	},
	{
		key: "Test Series",
		to: "/test-series",
		name: "Test Series",
		icon: <QuizIcon />,
	},
];

const SidebarGlobalStyles = () => {
	const theme = useTheme();
	return (
		<GlobalStyles
			styles={{
				".sidebar-nav-item": {
					color: "unset",
					textDecoration: "none",
				},
				".sidebar-nav-item-active": {
					textDecoration: "none",
					color: theme.palette.primary.main,
					"& .MuiSvgIcon-root": {
						color: theme.palette.primary.main,
					},
					"& .MuiTypography-root": {
						fontWeight: 500,
						color: theme.palette.primary.main,
					},
				},
			}}
		/>
	);
};
const SidebarGlobalStylesMemo = React.memo(SidebarGlobalStyles);

export function SideMenu(props: {
	mobileOpen: boolean;
	setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { mobileOpen, setMobileOpen } = props;

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<Box>
			<Toolbar />
			<Divider />
			<List>
				{listItems.map((li) => {
					return (
						<NavLink
							end={li.to === "/" ? true : false}
							className={(props) => {
								return `${
									props.isActive
										? "sidebar-nav-item-active"
										: "sidebar-nav-item"
								}`;
							}}
							to={li.to}
							key={li.key}
						>
							<ListItem button>
								<ListItemIcon>{li.icon}</ListItemIcon>
								<ListItemText primary={li.name} />
							</ListItem>
						</NavLink>
					);
				})}
			</List>
		</Box>
	);

	return (
		<Box
			component="nav"
			sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
		>
			<SidebarGlobalStylesMemo />

			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: "block", sm: "block", md: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: drawerWidth,
					},
				}}
			>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: "none", sm: "none", md: "block" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: drawerWidth,
					},
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	);
}

SideMenu.propTypes = {
	mobileOpen: PropTypes.bool,
	setMobileOpen: PropTypes.func.isRequired,
};

export default SideMenu;
