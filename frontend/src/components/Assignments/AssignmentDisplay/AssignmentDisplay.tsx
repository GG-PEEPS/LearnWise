
import { Assignment } from "../../../context/AssignmentContextProvider";
import { Box, Grid, Typography } from "@mui/material";
import AssignmentItem from "../AssignmentItem/AssignmentItem";

type Props = {
	title: string;
	assignments: Assignment[];
};

const AssignmentDisplay = ({ title, assignments }: Props) => {
	return (
		<Box
			sx={{
				py: 2,
			}}
		>
			<Typography variant="h5" sx={{}}>
				{title}
			</Typography>
			{assignments.length === 0 && (
				<Typography
					variant="body1"
					sx={{
						my: 1,
					}}
				>
					No assignments
				</Typography>
			)}
			<Grid
				container
				spacing={3}
				sx={{
					my: 1,
				}}
			>
				{assignments.map((assignment) => (
					<Grid item key={assignment.id} lg={4} md={6} xs={12}>
						<AssignmentItem assignment={assignment} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default AssignmentDisplay;
