import React from "react";
import { Subject } from "../../../context/SubjectContextProvider";
import { Box, Paper, Typography } from "@mui/material";

type Props = {
	subject: Subject;
};

const SubjectItem = ({ subject }: Props) => {
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
                {subject.name}
            </Typography>
        </Box>
	);
};

export default SubjectItem;
