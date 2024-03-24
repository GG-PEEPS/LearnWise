import { Box, Button, Typography } from "@mui/material";
import React, { useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import CreateSubjectDialog from "../../components/Subjects/CreateSubjectDialog/CreateSubjectDialog";
import { SubjectContext } from "../../context/SubjectsContextProvider";
import SubjectDisplay from "../../components/Subjects/SubjectDisplay/SubjectDisplay";

type Props = {};

const Subjects = (props: Props) => {
	const [open, setOpen] = React.useState(false);

	const { subjects } = useContext(SubjectContext);

	return (
		<>
			{open && <CreateSubjectDialog open={open} setOpen={setOpen} />}
			<Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Typography variant="h4">Subjects</Typography>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => setOpen(true)}
					>
						<AddIcon />
						Add Subject
					</Button>
				</Box>
				<SubjectDisplay subjects={subjects} />
			</Box>
		</>
	);
};

export default Subjects;
