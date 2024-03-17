import React, { useContext } from "react";
import {
	Assignment,
	AssignmentContext,
} from "../../../context/AssignmentContextProvider";
import { Box, Button, Checkbox, Paper, Typography } from "@mui/material";
import platformParser from "../../../helpers/platformParser";
import formatDate from "../../../helpers/formatDate";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditAssignmentDialog from "../EditAssignmentDialog/EditAssignmentDialog";

type Props = {
	assignment: Assignment;
};

const AssignmentItem = ({ assignment }: Props) => {
	const [checked, setChecked] = React.useState(assignment.completed);
	const { toggleComplete } = useContext(AssignmentContext);
	const [open, setOpen] = React.useState(false);

	return (
		<>
			{open && (
				<EditAssignmentDialog
					open={open}
					setOpen={setOpen}
					assignmentId={assignment.id}
					title={assignment.title}
					platform={assignment.platform}
					deadline={assignment.deadline}
				/>
			)}

			<Box
				component={Paper}
				sx={{
					p: 2,
				}}
			>
				<Typography
					variant="h6"
					sx={{
						my: 1,
					}}
				>
					{assignment.title}
				</Typography>
				<Typography
					variant="body1"
					sx={{
						my: 1,
					}}
				>
					{platformParser(assignment.platform)}
				</Typography>
				<Typography
					variant="subtitle1"
					sx={{
						display: "flex",
						my: 1,
						gap: 1,
					}}
				>
					<CalendarTodayIcon />
					{formatDate(assignment.deadline)}
				</Typography>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Typography
						sx={{
							display: "flex",
							my: 1,
							gap: 1,
						}}
					>
						<Checkbox
							sx={{
								padding: 0,
							}}
							checked={checked}
							onChange={(e) => {
								toggleComplete(assignment.id);
								setChecked(e.target.checked);
							}}
							inputProps={{ "aria-label": "controlled" }}
						/>
						Completed
					</Typography>
					<Button onClick={() => setOpen(true)}>Edit</Button>
				</Box>
			</Box>
		</>
	);
};

export default AssignmentItem;
