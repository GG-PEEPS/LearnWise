import { Box, Button, Dialog, Paper, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { StudyContext } from "../../../context/StudyContextProvider";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PdfUploadDialog = (props: Props) => {
	const { open, setOpen } = props;
	const { addDocument } = useContext(StudyContext);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleClose = () => {
		setOpen(false);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedFile(event.target.files[0]);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				elevation: 0,
				sx: {
					minWidth: "50%",
				},
			}}
		>
			<Box
				component={Paper}
				sx={{
					padding: "1rem",
				}}
			>
				<Typography variant="h5">Add a new PDF</Typography>
				<Box mt={2}>
					<input type="file" accept=".pdf" onChange={handleFileChange} />
				</Box>
				<Box mt={2}>
					<Button
						variant="contained"
						color="primary"
						onClick={async ()=>{
                            await addDocument(selectedFile as File)
                            handleClose()
                        }}
						disabled={!selectedFile}
					>
						Upload
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
};

export default PdfUploadDialog;
