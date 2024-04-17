import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import SubjectDisplay from "../../components/Subjects/SubjectDisplay/SubjectDisplay";
import { TestseriesContext } from "../../context/TestSeriesContextProvider";

type Props = {};

const TestSeries = (props: Props) => {
    const {subjects}=useContext(TestseriesContext)
	return (
		<Box>
			<Typography variant="h4">Choose a subject</Typography>
			<SubjectDisplay subjects={subjects} />
		</Box>
	);
};  

export default TestSeries;
