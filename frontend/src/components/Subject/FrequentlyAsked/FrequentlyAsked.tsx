import { Box, Button, Paper, Typography } from "@mui/material";
import React, { useContext } from "react";
import { StudyContext } from "../../../context/StudyContextProvider";
import { useNavigate, useParams } from "react-router-dom";

type Props = {};

const FrequentlyAsked = (props: Props) => {
	const { subjectId } = useParams();
	const { questions } = useContext(StudyContext);
	const navigate = useNavigate();
	return (
		<Box
			component={Paper}
			sx={{
				p: 2,
				height: "35vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<Box
				sx={{
					flex: 1,
				}}
			>
				<Typography variant="h5">Questions generated from Notes</Typography>
				{questions.slice(0, 5).map((question, index) => (
					<Typography key={index} variant="body1" sx={{ mt: 1 }}>
						{index + 1}) {question.question}
					</Typography>
				))}
			</Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Button
					onClick={() => navigate(`/subjects/${subjectId}/faq`)}
					variant="outlined"
				>
					Look at more FAQs
				</Button>
			</Box>
		</Box>
	);
};

export default FrequentlyAsked;
