import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { StudyContext } from "../../context/StudyContextProvider";
import SubjectFAQItem from "../../components/Subject/SubjectFAQ/SubjectFAQItem";

const SubjectFAQ = () => {
	const { questions, subjectName, questionsLoader } = useContext(StudyContext);
	return (
		<Box>
			<Typography variant="h4">Top Questions - {subjectName}</Typography>
			{questionsLoader && (
				<Box
					sx={{
						mt: 1,
						textAlign: "center",
					}}
				>
					<CircularProgress
						sx={{
							width: "100%",
							mt: 1,
						}}
					/>
				</Box>
			)}
			<Grid container>
				{questions.map((question, index) => (
					<Grid item xs={12} key={index}>
						<SubjectFAQItem question={question} index={index} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default SubjectFAQ;
