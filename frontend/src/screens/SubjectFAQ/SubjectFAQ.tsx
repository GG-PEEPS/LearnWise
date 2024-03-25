import { Box, Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import { StudyContext } from "../../context/StudyContextProvider";
import SubjectFAQItem from "../../components/Subject/SubjectFAQ/SubjectFAQItem";

type Props = {};

const SubjectFAQ = (props: Props) => {
	const { questions, subjectName } = useContext(StudyContext);
	return (
		<Box>
			<Typography variant="h5">Top Questions - {subjectName}</Typography>
			<Grid container>
				{questions.map((question, index) => (
					<Grid item xs={12} key={index}>
						<SubjectFAQItem question={question} index={index}/>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default SubjectFAQ;
