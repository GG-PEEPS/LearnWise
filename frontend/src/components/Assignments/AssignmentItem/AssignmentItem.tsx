import React, { useContext } from "react";
import {
	Assignment,
	AssignmentContext,
} from "../../../context/AssignmentContextProvider";
import { Box, Checkbox, Paper, Typography } from "@mui/material";
import platformParser from "../../../helpers/platformParser";
import formatDate from "../../../helpers/formatDate";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

type Props = {
	assignment: Assignment;
};

const AssignmentItem = ({ assignment }: Props) => {
	const [checked, setChecked] = React.useState(assignment.completed);
	const { toggleComplete } = useContext(AssignmentContext);

	return (
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
			<Box>
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
			</Box>
		</Box>
	);
};

export default AssignmentItem;
