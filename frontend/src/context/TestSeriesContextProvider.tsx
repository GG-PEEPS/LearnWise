import React, { createContext, useEffect } from "react";
import { Subject } from "./SubjectsContextProvider";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import formatHttpApiError from "../helpers/formatHttpAPIError";

type Props = {
	children: React.ReactNode;
};

export type TestSeriesContextType = {
	subjects: Subject[];
};

export const TestseriesContext = createContext<TestSeriesContextType>({
	subjects: [],
});

const TestSeriesContextProvider = (props: Props) => {
	const [subjects, setSubjects] = React.useState<Subject[]>([]);

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

	return (
		<TestseriesContext.Provider value={{ subjects }}>
			{props.children}
		</TestseriesContext.Provider>
	);
};

export default TestSeriesContextProvider;
