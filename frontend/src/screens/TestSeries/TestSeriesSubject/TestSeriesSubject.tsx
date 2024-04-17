import React from "react";
import { useParams } from "react-router-dom";

type Props = {};

const TestSeriesSubject = (props: Props) => {
	const { subjectId } = useParams();

	return <div>{subjectId}</div>;
};

export default TestSeriesSubject;
