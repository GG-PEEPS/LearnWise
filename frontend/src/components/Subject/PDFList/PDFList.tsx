import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {};

const PDFList = (props: Props) => {
	const navigate = useNavigate();
	const { subjectId } = useParams();
	return (
		<Box
			component={Paper}
			sx={{
				p: 2,
				height: "35vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<Typography variant="h5">PDFs Uploaded</Typography>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Button
					onClick={() => navigate(`/subjects/${subjectId}/chat`)}
					variant="outlined"
				>
					Start learning
				</Button>
			</Box>
		</Box>
	);
};

export default PDFList;
