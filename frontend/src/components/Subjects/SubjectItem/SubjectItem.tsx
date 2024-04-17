import { Subject } from "../../../context/SubjectsContextProvider";
import { Box, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
	subject: Subject;
};

const SubjectItem = ({ subject }: Props) => {
	const location=useLocation()
	const router = useNavigate();
	return (
		<Box
			component={Paper}
			sx={{
				p: 2,
				cursor: "pointer",
			}}
			onClick={() => {
				if(location.pathname==="/subjects")
				router(`/subjects/${subject.id}`);
				else
				router(`/test-series/${subject.id}`);
			}}
		>
			<Typography
				variant="h6"
				sx={{
					my: 1,
				}}
			>
				{subject.name}
			</Typography>
		</Box>
	);
};

export default SubjectItem;
