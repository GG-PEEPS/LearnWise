import React, { useContext } from "react";
import { TestseriesContext } from "../../../context/TestSeriesContextProvider";
import { Box, Grid, Paper, Typography } from "@mui/material";

type Props = {};

const TestSeriesPYQ = (props: Props) => {
	const { pyqs, subjectName } = useContext(TestseriesContext);

	return (
		<Box>
			<Typography variant="h4">{subjectName} Past Year Questions</Typography>
			{pyqs.map((item, index) => (
				<Box
					sx={{
						my: 2,
					}}
          key={index}
				>
					<Typography variant="h5">{item.year}</Typography>
					<Grid container>
						{item.questions.map((question, index) => (
							<Grid
								item
								xs={12}
								key={index}
								component={Paper}
								sx={{
									my: 2,
								}}
							>
								<Box sx={{ p: 2, my: 2 }}>
									<Typography variant="h6">{question.question}</Typography>
									<Typography variant="body1">
										Marks: {question.marks}
									</Typography>
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
			))}
		</Box>
	);
};

export default TestSeriesPYQ;
