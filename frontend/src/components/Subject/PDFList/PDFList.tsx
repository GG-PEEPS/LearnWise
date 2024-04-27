import { Box, Button, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StudyContext } from "../../../context/StudyContextProvider";
import ShareIcon from "@mui/icons-material/Share";
import { enqueueSnackbar } from "notistack";

const PDFList = () => {
	const navigate = useNavigate();
	const { subjectId } = useParams();
	const { pdfList } = useContext(StudyContext);
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
				<Typography variant="h5">PDFs Uploaded</Typography>
				{pdfList.map((pdf, index) => (
					<Typography key={pdf.id} variant="body1" sx={{ mt: 1 }}>
						{index + 1} {pdf.title}
						<Button
							sx={{
								mx: 1,
								my:1
							}}
							onClick={() => {
								navigator.clipboard.writeText(import.meta.env.VITE_BACKEND_URL+ pdf.pdf_file);
								enqueueSnackbar("Link copied to clipboard", {
									variant: "success",
								});
							}}
						>
							<ShareIcon />
						</Button>
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
					onClick={() => navigate(`/subjects/${subjectId}/chat`)}
					variant="outlined"
				>
					Start learning
				</Button>
			</Box>
		</Box>
	);
};

export default PDFList;
