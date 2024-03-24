import React from "react";
import { Subject } from "../../../context/SubjectsContextProvider";
import { Box, Grid, Typography } from "@mui/material";
import SubjectItem from "../SubjectItem/SubjectItem";

type Props = {
	subjects: Subject[];
};

const SubjectDisplay = ({ subjects }: Props) => {
	return (
		<Box
			sx={{
				py: 2,
			}}
		>
			{subjects.length === 0 && (
				<Typography
					variant="body1"
					sx={{
						my: 1,
					}}
				>
					No Subjects
				</Typography>
			)}
			<Grid container spacing={2}>
				{subjects.map((subject) => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={subject.id}>
						<SubjectItem subject={subject} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default SubjectDisplay;
