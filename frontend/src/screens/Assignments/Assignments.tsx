import { Box, Button, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import AssignmentDisplay from "../../components/Assignments/AssignmentDisplay/AssignmentDisplay";
import { AssignmentContext } from "../../context/AssignmentContextProvider";
import CreateAssignmentDialog from "../../components/Assignments/CreateAssignmentDialog/CreateAssignmentDialog";

const Assignments = () => {
	const { pending_assignments, overdue_assignments, completed_assignments } =
		useContext(AssignmentContext);
	const [open, setOpen] = useState(false);

	return (
		<>
		{open && <CreateAssignmentDialog open={open} setOpen={setOpen} />}
			<Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Typography variant="h4">Assignments</Typography>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => setOpen(true)}
					>
						<AddIcon />
						Create Assignment
					</Button>
				</Box>
				<AssignmentDisplay title="Pending" assignments={pending_assignments} />
				<AssignmentDisplay title="Overdue" assignments={overdue_assignments} />
				<AssignmentDisplay
					title="Complete"
					assignments={completed_assignments}
				/>
			</Box>
		</>
	);
};

export default Assignments;
