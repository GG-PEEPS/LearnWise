import { Box, Paper, Typography } from "@mui/material";
import React from "react";

type Props = {};

const FrequentlyAsked = (props: Props) => {
	return (
		<Box
			component={Paper}
			sx={{
				p: 2,
				height: "35vh",
			}}
		>
			<Typography variant="h5">Frequently Asked</Typography>
		</Box>
	);
};

export default FrequentlyAsked;
