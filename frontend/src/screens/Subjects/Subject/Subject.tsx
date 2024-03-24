import { Box, Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import TimeSpent from "../../../components/Subject/TimeSpent/TimeSpent";
import FrequentlyAsked from "../../../components/Subject/FrequentlyAsked/FrequentlyAsked";
import PDFList from "../../../components/Subject/PDFList/PDFList";
import { StudyContext } from "../../../context/StudyContextProvider";

type Props = {};

const Subject = (props: Props) => {
	const { subjectId } = useParams();
	const { subjectName } = useContext(StudyContext);

	return (
		<Box>
			<Typography variant="h4">{subjectName}</Typography>

			<Grid
				container
				spacing={3}
				sx={{
					mt: 2,
				}}
			>
				<Grid item md={6} xs={12}>
					<TimeSpent />
				</Grid>
				<Grid item md={6} xs={12}>
					<FrequentlyAsked />
				</Grid>
				<Grid item xs={12}>
					<PDFList />
				</Grid>
			</Grid>
		</Box>
	);
};

export default Subject;