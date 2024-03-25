import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
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

export type chatType = {
	id: number;
	subject: number;
	created_at: string;
	from_type: string;
	message: string;
};
export type questionType = {
	question: string;
	answer: string;
};

export type StudyContextType = {
	subjectName: string;
	pdfList: pdfType[];
	deleteDocument: (id: number) => void;
	addDocument: (selectedFile: File) => void;
	chats: chatType[];
	addChat: (message: string) => void;
	totalTimeSpent: number;
	questions: questionType[];
};

export const StudyContext = createContext<StudyContextType>({
	subjectName: "",
	pdfList: [],
	deleteDocument: async () => {},
	addDocument: async () => {},
	chats: [],
	addChat: () => {},
	totalTimeSpent: 0,
	questions: [],
});

const StudyContextProvider = ({ children }: Props) => {
	const { subjectId } = useParams();
	const [subjectName, setSubjectName] = React.useState<string>(
		"Subject " + subjectId
	);
	const [pdfList, setPdfList] = React.useState<pdfType[]>([]);
	const [chats, setChats] = React.useState<chatType[]>([]);
	const [totalTimeSpent, setTotalTimeSpent] = useState(0);
	const [startTime, setStartTime] = useState(() => {
		const storedStartTime = parseInt(
			localStorage.getItem(`startTime_${subjectId}`)
		);
		return storedStartTime || Date.now();
	});
	const [questions, setQuestions] = useState<questionType[]>([]);
	useEffect(() => {
		const intervalId = setInterval(() => {
			const currentTime = Date.now();
			const elapsedTime = Math.floor((currentTime - startTime) / 1000);
			setTotalTimeSpent((prevTime) => elapsedTime);
			localStorage.setItem(`startTime_${subjectId}`, startTime.toString());
		}, 1000);

		return () => clearInterval(intervalId);
	}, [subjectId, startTime]);

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
		axios
			.get(
				import.meta.env.VITE_BACKEND_URL +
					"/study/getSubjectChats/" +
					subjectId,
				getCommonOptions()
			)
			.then((res) => {
				setChats(res.data);
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), {
					variant: "error",
				});
			});
	}, [subjectId]);

	useEffect(() => {
		axios
			.get(
				import.meta.env.VITE_BACKEND_URL + "/study/getFAQ/" + subjectId,
				getCommonOptions()
			)
			.then((res) => {
				setQuestions(res.data.questions);
			})
			.catch((err) => {
				setQuestions([]);
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
	const addDocument = async (selectedFile: File) => {
		try {
			const formData = new FormData();
			formData.append("pdf_file", selectedFile as Blob);
			const res = await axios.post(
				import.meta.env.VITE_BACKEND_URL + "/study/addDocument/" + subjectId,
				formData,
				getCommonOptions()
			);
			setPdfList([...pdfList, res.data]);

			enqueueSnackbar("Document Added Successfully", {
				variant: "success",
			});
		} catch (err) {
			enqueueSnackbar(formatHttpApiError(err), {
				variant: "error",
			});
		}
	};

	const addChat = (message: string) => {
		setChats([
			...chats,
			{ id: 0, subject: 0, created_at: "", from_type: "USER", message },
		]);
		axios
			.post(
				import.meta.env.VITE_BACKEND_URL + "/study/createChat/" + subjectId,
				{
					message: message,
				},
				getCommonOptions()
			)
			.then((res) => {
				setChats(res.data);
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), {
					variant: "error",
				});
			});
	};
	return (
		<StudyContext.Provider
			value={{
				subjectName,
				pdfList,
				deleteDocument,
				addDocument,
				chats,
				addChat,
				totalTimeSpent,
				questions,
			}}
		>
			{children}
		</StudyContext.Provider>
	);
};

export default StudyContextProvider;
