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

type Props = {};

const TestSeriesSubject = (props: Props) => {
	const { subjectId } = useParams();
	const { subjectName, pyqs } = useContext(TestseriesContext);
	const navigate = useNavigate();
	const [selectedYear, setSelectedYear] = React.useState(0);
	useEffect(() => {
		if(pyqs.length>0)
		setSelectedYear(pyqs[0].year);
	}, [pyqs]);

	return (
		<Box>
			<Typography variant="h4">{subjectName}</Typography>
			<Grid container>
				<Grid
					item
					xs={12}
					md={6}
					component={Paper}
					sx={{
						p: 2,
						my: 2,
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							flexDirection: "column",
							height: "fit-content",
							gap:"1rem"
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
				</Grid>
			</Grid>
		</Box>
	);
};

export default TestSeriesSubject;
