import axios from "axios";
import { enqueueSnackbar } from "notistack";
import React, { useEffect } from "react";
import formatHttpApiError from "../helpers/formatHttpAPIError";
import getCommonOptions from "../helpers/getCommonOptions";

export type Subject = {
	id: number;
	name: string;
};

type Props = {
	children: React.ReactNode;
};

export type SubjectContextType = {
	subjects: Subject[];
	addSubject: (subject: Omit<Subject, "id">) => void;
};

export const SubjectContext = React.createContext<SubjectContextType>({
	subjects: [],
	addSubject: () => {},
});

const SubjectContextProvider = (props: Props) => {
	const [subjects, setSubjects] = React.useState<Subject[]>([]);

	useEffect(() => {
		axios
			.get(
				import.meta.env.VITE_BACKEND_URL + "/study/getSubjects",
				getCommonOptions()
			)
			.then((res) => {
				setSubjects(res.data);
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), { variant: "error" });
			});
	}, []);

	const addSubject = async (subject: Omit<Subject, "id">) => {
		try {
			await axios.post(
				import.meta.env.VITE_BACKEND_URL + "/study/addSubject",
				{
					name: subject.name,
				},
				getCommonOptions()
			);
			enqueueSnackbar("Subject added successfully", { variant: "success" });
		} catch (err) {
			enqueueSnackbar(formatHttpApiError(err), { variant: "error" });
		}
	};

	return (
		<SubjectContext.Provider value={{ subjects, addSubject }}>
			{props.children}
		</SubjectContext.Provider>
	);
};

export default SubjectContextProvider;
