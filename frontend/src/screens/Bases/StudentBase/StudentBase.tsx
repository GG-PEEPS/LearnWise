import React from "react";
import Toolbar from "@mui/material/Toolbar";

import SideMenu from "./SideMenu";
import AppHeader from "./AppHeader";
import { Box } from "@mui/system";
import { Outlet, useLocation } from "react-router-dom";


function StudentBase() {
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const location = useLocation();

	return (
		<Box sx={{ display: "flex" }}>
			<AppHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
			<SideMenu mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

			<Box
				sx={{
					flexGrow: 1,
					padding: (theme) => theme.spacing(3),
					paddingTop: (theme) =>
						location.pathname.includes("chat") ? 0 : theme.spacing(3),
					paddingRight: (theme) =>
						location.pathname.includes("chat") ? 0 : theme.spacing(3),
				}}
			>
				{!location.pathname.includes("chat") && <Toolbar />}

				<Box>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}

export default StudentBase;
