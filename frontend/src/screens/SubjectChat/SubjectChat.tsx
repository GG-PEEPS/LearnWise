import  { useContext, useState } from "react";
import { StudyContext } from "../../context/StudyContextProvider";
import { Box, Button, Paper, Toolbar } from "@mui/material";
import PdfItem from "../../components/SubjectChat/PdfItem/PdfItem";
import PdfUploadDialog from "../../components/SubjectChat/PdfUploadDialog/PdfUploadDialog";
import Chat from "../../components/SubjectChat/Chat/Chat";


const SubjectChat = () => {
	const { pdfList } = useContext(StudyContext);
	const [open, setOpen] = useState(false);

	const handleUploadClick = () => {
		setOpen(true);
	};

	return (
		<>
			{open && <PdfUploadDialog open={open} setOpen={setOpen} />}
			<Box
				sx={{
					display: "flex",
					height: "100%",
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
							width: "100%",
							height: "calc(100vh - 88px)",
						}}
					>
						<Chat />
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
							{pdfList.map((pdf, index) => (
								<PdfItem pdf={pdf} key={index} />
							))}
						</Box>
						<Box>
							<Button variant="contained" fullWidth onClick={handleUploadClick}>
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
