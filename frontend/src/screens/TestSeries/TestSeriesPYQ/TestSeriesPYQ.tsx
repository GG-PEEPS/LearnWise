import React, { useContext, useEffect, useState } from "react";
import { TestseriesContext } from "../../../context/TestSeriesContextProvider";
import {
	Box,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import PYQItem from "../../../components/TestSeriesPYQ/PYQItem/PYQItem";

type Props = {};

const TestSeriesPYQ = (props: Props) => {
	const { pyqs, subjectName } = useContext(TestseriesContext);
	const { year } = useParams();
	const [selectedYear, setSelectedYear] = React.useState(0);
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		if (pyqs.length > 0) setSelectedYear(pyqs[0].year);
	}, [year, pyqs]);

	useEffect(() => {
		setSelectedIndex(pyqs.findIndex((pyq) => pyq?.year === selectedYear));
	}, [selectedYear, pyqs]);

	return (
		<>
			{year && pyqs.length > 0 && (
				<Box>
					<Typography variant="h4">
						{subjectName} Past Year Questions
					</Typography>
					<FormControl
						fullWidth
						sx={{
							my: 2,
						}}
					>
						<InputLabel id="demo-simple-select-label">Year</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							label="Year"
							value={selectedYear as number}
							onChange={(e) => setSelectedYear(e.target.value as number)}
						>
							{pyqs.map((pyq) => (
								<MenuItem key={pyq.year} value={pyq.year}>
									{pyq.year}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Box
						sx={{
							my: 2,
						}}
					>
						<Typography variant="h5">{pyqs[selectedIndex]?.year}</Typography>
						<Grid container>
							{pyqs[selectedIndex]?.questions.map((question, index) => (
								<PYQItem key={index} question={question} index={index} />
							))}
						</Grid>
					</Box>
				</Box>
			)}
		</>
	);
};

export default TestSeriesPYQ;
