import {
	Box,
	Button,
	Dialog,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AssignmentContext } from "../../../context/AssignmentContextProvider";
import { enqueueSnackbar } from "notistack";

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	assignmentId: number;
	title: string;
	platform: string;
	deadline: string;
};

const EditAssignmentDialog = ({
	open,
	setOpen,
	assignmentId,
	title: initialTitle,
	platform: initialPlatform,
	deadline: initialDeadline,
}: Props) => {
	console.log(initialDeadline, new Date(initialDeadline));
	const [title, setTitle] = useState<string>(initialTitle);
	const [platform, setPlatform] = useState<string>(initialPlatform);
	const [deadline, setDeadline] = useState<string>(initialDeadline);
	const { editAssignment } = useContext(AssignmentContext);

	const handleClose = () => {
		setOpen(false);
	};

	const handleSubmit = () => {
		if (!title.length || !platform.length || !deadline.length) {
			enqueueSnackbar("Please fill all the fields", { variant: "error" });
			return;
		}
		handleClose();
		return;
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
				<Typography variant="h5">Edit assignment</Typography>
				<Box mt={2}>
					<TextField
						label="Title"
						variant="outlined"
						fullWidth
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</Box>
				<Box mt={2}>
					<Select
						label="Platform"
						variant="outlined"
						fullWidth
						value={platform}
						onChange={(e) => setPlatform(e.target.value as string)}
					>
						<MenuItem value="GOOGLECLASSROOM">Google Classroom</MenuItem>
						<MenuItem value="LMS">LMS</MenuItem>
						<MenuItem value="TEAMS">Teams</MenuItem>
					</Select>
				</Box>
				<Box mt={2}>
					<TextField
						label="Deadline"
						variant="outlined"
						fullWidth
						type="date"
						value={deadline}
						onChange={(e) => setDeadline(e.target.value)}
					/>
				</Box>
				<Box mt={2} display="flex" justifyContent="flex-end">
					<Button variant="contained" onClick={handleSubmit}>
						Edit
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
};

export default EditAssignmentDialog;
