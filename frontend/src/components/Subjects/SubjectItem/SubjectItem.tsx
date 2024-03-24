import React from "react";
import { Subject } from "../../../context/SubjectsContextProvider";
import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
	subject: Subject;
};

const SubjectItem = ({ subject }: Props) => {
	const router = useNavigate();
	return (
		<Box
			component={Paper}
			sx={{
				p: 2,
				cursor: "pointer",
			}}
			onClick={() => {
				router(`/subjects/${subject.id}`);
			}}
		>
			<Typography
				variant="h6"
				sx={{
					my: 1,
				}}
			>
				{subject.name}
			</Typography>
		</Box>
	);
};

export default SubjectItem;
