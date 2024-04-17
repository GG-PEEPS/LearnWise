import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TestseriesContext } from "../../../context/TestSeriesContextProvider";

type Props = {};

const TestSeriesSubject = (props: Props) => {
	const { subjectId } = useParams();
	const { subjectName } = useContext(TestseriesContext);
	const navigate=useNavigate()

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
							alignItems: "center",
						}}
					>
						<Typography variant="h6">Previous year questions</Typography>
						<Button variant="contained" color="primary" onClick={()=>{
							navigate(`/test-series/${subjectId}/previous-year-questions`)
						}}>
							open
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Box>	
	);
};

export default TestSeriesSubject;
