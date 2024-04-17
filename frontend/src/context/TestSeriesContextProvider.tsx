import React, { createContext, useEffect, useState } from "react";
import { Subject } from "./SubjectsContextProvider";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import formatHttpApiError from "../helpers/formatHttpAPIError";
import { useParams } from "react-router-dom";

type Props = {
	children: React.ReactNode;
};

export type TestSeriesContextType = {
	subjects: Subject[];
	subjectName: string;
	pyqs: PYQsType[];
};
export type PyqsQuestionType = {
	id: string;
	question: string;
	year: string;
	marks: string;
};

export type PYQsType = {
	year: number;
	questions: PyqsQuestionType[];
};

export const TestseriesContext = createContext<TestSeriesContextType>({
	subjects: [],
	subjectName: "",
	pyqs: [],
});

const TestSeriesContextProvider = (props: Props) => {
	const { subjectId } = useParams();
	const [subjectName, setSubjectName] = useState<string>("");
	const [subjects, setSubjects] = React.useState<Subject[]>([]);
	const [pyqs, setPyqs] = React.useState<PYQsType[]>([]);

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/study/getTestSubjects")
			.then((res) => {
				setSubjects(res.data);
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), { variant: "error" });
			});
	}, []);

	useEffect(() => {
		if (!subjectId) return;
		setSubjectName(() => {
			const subject = subjects.find(
				(subject) => subject.id.toString() === subjectId
			);
			return subject?.name || "";
		});
		const getData = async () => {
			try {
				const res = await axios.get(
					import.meta.env.VITE_BACKEND_URL + `/study/getPYQ/${subjectId}`
				);
				setPyqs(res.data);
				console.log(res.data);
			} catch (err) {
				enqueueSnackbar(formatHttpApiError(err), { variant: "error" });
			}
		};
		getData();
	}, [subjectId, subjects]);

	return (
		<TestseriesContext.Provider value={{ subjects, subjectName, pyqs }}>
			{props.children}
		</TestseriesContext.Provider>
	);
};

export default TestSeriesContextProvider;
