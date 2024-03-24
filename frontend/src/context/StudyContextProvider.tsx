import axios from "axios";
import React, { createContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import getCommonOptions from "../helpers/getCommonOptions";
import { enqueueSnackbar } from "notistack";
import formatHttpApiError from "../helpers/formatHttpAPIError";

type Props = {
	children: React.ReactNode;
};
export type pdfType = {
	id: number;
	subject: number;
	title: string;
	created_at: string;
	pdf_file: string;
};

export type StudyContextType = {
	subjectName: string;
	pdfList: pdfType[];
	deleteDocument: (id: number) => void;
};

export const StudyContext = createContext<StudyContextType>({
	subjectName: "",
	pdfList: [],
	deleteDocument: async () => {},
});

const StudyContextProvider = ({ children }: Props) => {
	const { subjectId } = useParams();
	const [subjectName, setSubjectName] = React.useState<string>(
		"Subject " + subjectId
	);
	const [pdfList, setPdfList] = React.useState<pdfType[]>([]);

	useEffect(() => {
		axios
			.get(
				import.meta.env.VITE_BACKEND_URL + "/study/getDocuments/" + subjectId,
				getCommonOptions()
			)
			.then((res) => {
				setPdfList(res.data);
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), {
					variant: "error",
				});
			});
	}, [subjectId]);

	const deleteDocument = async (id: number) => {
		try {
			await axios.delete(
				import.meta.env.VITE_BACKEND_URL + "/study/deleteDocument/" + id,
				getCommonOptions()
			);
			setPdfList(pdfList.filter((pdf) => pdf.id !== id));
			enqueueSnackbar("Document Deleted Successfully", {
				variant: "success",
			});
		} catch (err) {
			enqueueSnackbar(formatHttpApiError(err), {
				variant: "error",
			});
		}
	};

	return (
		<StudyContext.Provider
			value={{
				subjectName,
				pdfList,
				deleteDocument
			}}
		>
			{children}
		</StudyContext.Provider>
	);
};

export default StudyContextProvider;
