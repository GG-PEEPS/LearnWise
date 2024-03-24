import { Box, Paper, Typography } from "@mui/material";
import React from "react";

type Props = {};

const TimeSpent = (props: Props) => {
	return (
		<Box
			component={Paper}
			sx={{
				p: 2,
				height: "35vh",
			}}
		>
			<Typography variant="h5">Time Spent</Typography>
		</Box>
	);
};

export default TimeSpent;
