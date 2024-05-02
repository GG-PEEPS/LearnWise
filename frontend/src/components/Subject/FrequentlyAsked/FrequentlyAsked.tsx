import {
	Box,
	Button,
	CircularProgress,
	LinearProgress,
	Paper,
	Typography,
} from "@mui/material";
import { useContext } from "react";
import { StudyContext } from "../../../context/StudyContextProvider";
import { useNavigate, useParams } from "react-router-dom";

const FrequentlyAsked = () => {
	const { subjectId } = useParams();
	const { questions, questionsLoader } = useContext(StudyContext);
	const navigate = useNavigate();
	return (
		<Box
			component={Paper}
			sx={{
				p: 2,
				minHeight: "35vh",
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
