import React, { useState } from "react";
import { questionType } from "../../../context/StudyContextProvider";
import { Box, Button, Paper, Collapse, Typography } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

type Props = {
	question: questionType;
	index: number;
};

const SubjectFAQItem = ({ question, index }: Props) => {
	const [open, setOpen] = useState(false);

	return (
		<Box
			component={Paper}
			sx={{
				py: 2,
				px: 3,
				my: 2,
				transition: "box-shadow 0.3s",
				"&:hover": {
					boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
				},
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Typography variant="h6">
					Q{index + 1} {question.question}
				</Typography>
				<Button
					onClick={() => setOpen((prev) => !prev)}
					endIcon={<ExpandMoreIcon />}
					sx={{ textTransform: "none" }}
				>
					{open ? "Close Answer" : "See Answer"}
				</Button>
			</Box>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<Typography variant="body1">{question.answer}</Typography>
			</Collapse>
		</Box>
	);
};

export default SubjectFAQItem;
