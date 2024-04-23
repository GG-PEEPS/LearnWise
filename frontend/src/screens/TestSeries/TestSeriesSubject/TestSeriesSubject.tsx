import {
	Box,
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TestseriesContext } from "../../../context/TestSeriesContextProvider";


const TestSeriesSubject = () => {
	const { subjectId } = useParams();
	const { subjectName, pyqs } = useContext(TestseriesContext);
	const navigate = useNavigate();
	const [selectedYear, setSelectedYear] = React.useState(0);
	useEffect(() => {
		if (pyqs.length > 0) setSelectedYear(pyqs[0].year);
	}, [pyqs]);

	return (
		<Box>
			<Typography variant="h4">{subjectName}</Typography>
			<Grid
				container
				spacing={2}
				sx={{
					marginTop: "1rem",
				}}
			>
				<Grid item xs={6}>
					<Paper sx={{ p: 2 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								flexDirection: "column",
								height: "fit-content",
								gap: "1rem",
								minHeight:"20vh"
							}}
						>
							<Typography variant="h6">Previous year questions</Typography>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">Year</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									label="Year"
									value={selectedYear}
									onChange={(e) => setSelectedYear(e.target.value as number)}
								>
									{pyqs.map((pyq) => (
										<MenuItem key={pyq.year} value={pyq.year}>
											{pyq.year}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Button
								variant="outlined"
								onClick={() => {
									navigate(
										`/test-series/${subjectId}/previous-year-questions/${selectedYear}`
									);
								}}
							>
								open
							</Button>
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper sx={{ p: 2 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								flexDirection: "column",
								height: "fit-content",
								gap: "1rem",
								minHeight:"20vh"
							}}
						>
							<Typography variant="h6">Mock tests</Typography>
							<Button
								variant="outlined"
								onClick={() => {
									navigate(`/test-series/${subjectId}/mock-tests`);
								}}
							>
								open
							</Button>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default TestSeriesSubject;
