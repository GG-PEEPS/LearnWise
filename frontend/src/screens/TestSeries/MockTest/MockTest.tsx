import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { StudyContext } from "../../../context/StudyContextProvider";
import getCommonOptions from "../../../helpers/getCommonOptions";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Add } from "@mui/icons-material";
import formatHttpApiError from "../../../helpers/formatHttpAPIError";
import { enqueueSnackbar } from "notistack";
import { MockTestType } from "../../../global";
import PYQItem from "../../../components/TestSeriesPYQ/PYQItem/PYQItem";

const MockTest = () => {
	const getMockTest = () => {
		setLoading(true);
		return axios
			.get(
				import.meta.env.VITE_BACKEND_URL + "/study/getTestSeries/" + subjectId,
				getCommonOptions()
			)
			.then((res) => {
				console.log(res.data);
				setMockTestData(res.data);
				setLoading(false);
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), {
					variant: "error",
				});
				setLoading(false);
			});
	};
	const downloadPdf = () => {
		axios
			.post(
				import.meta.env.VITE_BACKEND_URL +
					"/study/pdfTestSeriesQuestions/" +
					subjectId,
				mockTestData,
				getCommonOptions()
			)
			.then((res) => {
				window.open(
					import.meta.env.VITE_BACKEND_URL  + res.data.file
				);
				const link=document.createElement("a")
				link.href=import.meta.env.VITE_BACKEND_URL  + res.data.file
				link.download="mockTest.pdf"
				// link.target="_blank"
				link.click()
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), {
					variant: "error",
				});
			});
	};
	const { subjectId } = useParams();
	const [mockTestData, setMockTestData] = useState<MockTestType>([]);
	const [loading, setLoading] = useState(false);

	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Typography variant="h4">Mock Questions</Typography>
				<Box>
					{mockTestData.length > 0 && (
						<Button
							variant="contained"
							color="secondary"
							onClick={() => {
								downloadPdf();
							}}
							sx={{
								marginRight: "1rem",
							}}
						>
							Download PDF
						</Button>
					)}

					<Button
						variant="contained"
						color="secondary"
						onClick={() => {
							getMockTest();
						}}
					>
						<Add />
						Generate random questions
					</Button>
				</Box>
			</Box>
			{loading && (
				<LinearProgress
					sx={{
						marginTop: "1rem",
					}}
				/>
			)}
			{!loading &&
				mockTestData.map((data, key) => {
					return (
						<Box key={key}>
							<Typography variant="h6">{data.marks} mark Questions</Typography>
							{data.questions.map((question, index) => {
								return (
									<PYQItem
										question={question}
										key={index}
										marks={data.marks.toString()}
										index={index}
										mock={true}
									/>
								);
							})}
						</Box>
					);
				})}
		</Box>
	);
};

export default MockTest;
