import {
	Box,
	Button,
	Grid,
	LinearProgress,
	Paper,
	Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { TestseriesContext } from "../../../context/TestSeriesContextProvider";
import EmptyTextarea from "../../../helpers/TextAreaAuto";
import roundToNearestHalf from "../../../helpers/RoundToNearestHalf";
import { MockTestQuestionsType } from "../../../global";
type Props = {
	question: MockTestQuestionsType;
	index: number;
	marks: string;
	mock?: boolean;
};
const arr = ["A", "B", "C", "D"];

const PYQItem = ({ question, index, marks, mock = false }: Props) => {
	const { getAnswer, getScore } = useContext(TestseriesContext);
	const [viewAnswer, setViewAnswer] = useState<boolean>(false);
	const [viewUserAnswer, setViewUserAnswer] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [answer, setAnswer] = useState<string>("");
	const [userAnswer, setUserAnswer] = useState<string>("");
	const [finalScore, setFinalScore] = useState<number>(0);
	const [submitted, setSubmitted] = useState<boolean>(false);

	const handleGetAnswer = async () => {
		setLoading(true);
		setViewAnswer((prev) => !prev);
		setViewUserAnswer(false);
		if (mock) {
			if (marks === "1") {
				setAnswer(question?.correct_answer || "No answer found");
			} else {
				setAnswer(question?.answer || "No answer found");
			}
		} else {
			setAnswer(await getAnswer(question.question));
		}
		setLoading(false);
	};
	const handleGetUserAnswer = async () => {
		setViewUserAnswer((prev) => !prev);
		setViewAnswer(false);
	};
	const handleSubmitAnswer = () => {
		setSubmitted(true);
		setLoading(true);

		getScore(question.question, userAnswer)
			.then((score) => {
				setFinalScore(score);
				setLoading(false);
				setSubmitted(true);
			})
			.catch(() => {
				setLoading(false);
			});
	};

	return (
		<Grid
			item
			xs={12}
			key={index}
			component={Paper}
			sx={{
				my: 2,
			}}
		>
			<Box sx={{ p: 2, mt: 2 }}>
				<Typography variant="h6">{question.question}</Typography>
				{question.options && (
					<Box>
						<Typography variant="body1">Options: </Typography>
						{question.options.map((option, key) => (
							<Typography key={key} variant="body1">
								{arr[key]}. {option}
							</Typography>
						))}
					</Box>
				)}
				<Typography variant="body1">Marks: {marks}</Typography>
			</Box>

			<Box>
				<Button
					variant="contained"
					color="primary"
					sx={{ m: 2 }}
					onClick={() => handleGetAnswer()}
				>
					View Answer
				</Button>
				{(!mock || marks != "1") && (
					<Button
						variant="contained"
						color="primary"
						sx={{ m: 2 }}
						onClick={() => handleGetUserAnswer()}
					>
						View User Answer
					</Button>
				)}
			</Box>
			{viewAnswer && (
				<Box sx={{ p: 2 }}>
					<Typography variant="h6">Answer</Typography>
					{loading && <LinearProgress />}
					<Typography variant="body1">{answer}</Typography>
				</Box>
			)}
			{viewUserAnswer && (
				<Box sx={{ p: 2 }}>
					<Typography variant="h6">User Answer</Typography>
					<Box
						sx={{
							display: "flex",
							my: 1,
						}}
					>
						<EmptyTextarea
							value={userAnswer}
							onChange={(e) => setUserAnswer(e)}
							placeholder="Enter your answer"
						/>
						<Button
							variant="contained"
							color="primary"
							sx={{ mx: 2, minWidth: "fit-content" }}
							onClick={() => handleSubmitAnswer()}
						>
							Submit Answer
						</Button>
					</Box>
					{submitted && (
						<>
							{loading && <LinearProgress />}
							{!loading && (
								<Typography variant="body1">
									Score:{" "}
									{roundToNearestHalf(finalScore * parseFloat(question.marks))}
								</Typography>
							)}
						</>
					)}
				</Box>
			)}
		</Grid>
	);
};

export default PYQItem;
