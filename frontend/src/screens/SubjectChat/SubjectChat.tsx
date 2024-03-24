import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { StudyContext } from "../../context/StudyContextProvider";
import { Box, Button, Paper, Toolbar, Typography } from "@mui/material";
import PdfItem from "../../components/SubjectChat/PdfItem/PdfItem";
import PdfUploadDialog from "../../components/SubjectChat/PdfUploadDialog/PdfUploadDialog";

type Props = {};

const SubjectChat = (props: Props) => {
	const { subjectName, pdfList } = useContext(StudyContext);
	const [open, setOpen] = useState(false);

	const handleUploadClick=()=>{
		setOpen(true)
	}


	return (
		<>
		{open && <PdfUploadDialog open={open} setOpen={setOpen} />}
			<Box
				sx={{
					display: "flex",
				}}
			>
				<Box
					sx={{
						flex: 1,
					}}
				>
					<Toolbar />
					<Box
						sx={{
							paddingTop: (theme) => theme.spacing(3),
						}}
					>
						<Typography variant="h4">{subjectName}</Typography>
					</Box>
				</Box>
				<Box
					sx={{
						width: 240,
						height: "100vh",
						borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
						overflow: "none",
						position: "fixed",
						right: 0,
						py: (theme) => theme.spacing(3),
						px: (theme) => theme.spacing(2),
					}}
				>
					<Toolbar />
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							height: "calc(100% - 64px)",
						}}
					>
						<Box
							component={Paper}
							sx={{
								margin: "auto",
								padding: 2,
							}}
						>
							PDFs Uploaded
						</Box>
						<Box
							sx={{
								flex: 1,
							}}
						>
							{pdfList.map((pdf) => (
								<PdfItem pdf={pdf} />
							))}
						</Box>
						<Box>
							<Button variant="contained" fullWidth  onClick={handleUploadClick}>
								Upload PDF
							</Button>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default SubjectChat;
