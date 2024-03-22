import {
	Box,
	Button,
	Dialog,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { SubjectContext } from "../../../context/SubjectContextProvider";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateSubjectDialog = ({ open, setOpen }: Props) => {
	const [title, setTitle] = useState<string>("");

	const { addSubject } = useContext(SubjectContext);

	const handleClose = () => {
		setOpen(false);
	};

	const handleSubmit = async () => {
		if (title === "") {
			return enqueueSnackbar("Subject title cannot be empty", {
				variant: "error",
			});
		}
		await addSubject({ name: title });
		handleClose();
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
				<Typography variant="h5">Add a new subject</Typography>
				<Box mt={2}>
					<TextField
						label="Title"
						variant="outlined"
						fullWidth
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</Box>
				<Box mt={2} display="flex" justifyContent="flex-end">
					<Button
						variant="contained"
						color="primary"
						onClick={() => handleSubmit()}
					>
						Add
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
};

export default CreateSubjectDialog;
