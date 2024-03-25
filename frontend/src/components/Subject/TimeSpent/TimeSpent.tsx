import { Box, Paper, Typography } from "@mui/material";
import  { useContext } from "react";
import { StudyContext } from "../../../context/StudyContextProvider";


const TimeSpent = () => {
	const { totalTimeSpent } = useContext(StudyContext);

	const formatTime = (timeInSeconds:number) => {
		const hours = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds % 3600) / 60);
		const seconds = timeInSeconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	return (
		<Box
			component={Paper}
			sx={{
				p: 2,
				height: "35vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Typography variant="h5" gutterBottom>
				Time Spent
			</Typography>
			<Typography variant="h4">{formatTime(totalTimeSpent)}</Typography>
		</Box>
	);
};

export default TimeSpent;
