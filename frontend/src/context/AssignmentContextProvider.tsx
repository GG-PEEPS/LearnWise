import axios from "axios";
import { createContext, useEffect, useState } from "react";
import getCommonOptions from "../helpers/getCommonOptions";
import formatHttpApiError from "../helpers/formatHttpAPIError";
import { enqueueSnackbar } from "notistack";

export type Assignment = {
	id: number;
	user: number;
	title: string;
	platform: "GOOGLECLASSROOM" | "LMS" | "TEAMS";
	deadline: string;
	completed: boolean;
};

export type AssignmentContextType = {
	pending_assignments: Assignment[];
	overdue_assignments: Assignment[];
	completed_assignments: Assignment[];
	toggleComplete: (assignmentId: Assignment["id"]) => void;
	addAssignment: (
		assignment: Omit<Assignment, "id" | "completed" | "user">
	) => void;
	getAssignment: (assignmentId: Assignment["id"]) => Assignment | null;
	editAssignment: (
		assignmentId: number,
		title: string,
		platform: string,
		deadline: string
	) => void;
};

export const AssignmentContext = createContext<AssignmentContextType>({
	pending_assignments: [],
	overdue_assignments: [],
	completed_assignments: [],

	toggleComplete: () => {},
	addAssignment: () => {},
	getAssignment: () => {
		return null;
	},
	editAssignment: () => {},
});

export default function AssignmentContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [pending_assignments, setPendingAssignments] = useState<Assignment[]>(
		[]
	);
	const [overdue_assignments, setOverdueAssignments] = useState<Assignment[]>(
		[]
	);
	const [completed_assignments, setCompletedAssignments] = useState<
		Assignment[]
	>([]);

	useEffect(() => {
		axios
			.get(
				import.meta.env.VITE_BACKEND_URL + "/assignments/getAssignments",
				getCommonOptions()
			)
			.then((res) => {
				const data = res.data;
				setPendingAssignments(data.pending_assignments);
				setOverdueAssignments(data.overdue_assignments);
				setCompletedAssignments(data.completed_assignments);
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), { variant: "error" });
			});
	}, []);

	function toggleComplete(assignmentId: Assignment["id"]) {
		axios
			.post(
				import.meta.env.VITE_BACKEND_URL + "/assignments/toggleAssignment",
				{
					assignmentId: assignmentId,
				},
				getCommonOptions()
			)
			.then((res) => {
				const data = res.data;
				setPendingAssignments(data.pending_assignments);
				setOverdueAssignments(data.overdue_assignments);
				setCompletedAssignments(data.completed_assignments);
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), { variant: "error" });
			});
	}

	const addAssignment = ({
		title,
		platform,
		deadline,
	}: Omit<Assignment, "id" | "completed" | "user">) => {
		axios
			.post(
				import.meta.env.VITE_BACKEND_URL + "/assignments/addAssignment",
				{
					title,
					platform,
					deadline,
				},
				getCommonOptions()
			)
			.then((res) => {
				const data = res.data;
				setPendingAssignments(data.pending_assignments);
				setOverdueAssignments(data.overdue_assignments);
				setCompletedAssignments(data.completed_assignments);
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), { variant: "error" });
			});
	};

	const getAssignment = (assignmentId: number): Assignment | null => {
		let result = null;
		axios
			.get(
				import.meta.env.VITE_BACKEND_URL +
					"/assignments/getAssignment?assignmentId=" +
					assignmentId,
				getCommonOptions()
			)
			.then((res) => {
				const data = res.data;
				result = data;
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), { variant: "error" });
			});
		return result;
	};

	const editAssignment = (
		assignmentId: number,
		title: string,
		platform: string,
		deadline: string
	) => {
		axios
			.put(
				import.meta.env.VITE_BACKEND_URL +
					"/assignments/editAssignment?assignmentId=" +
					assignmentId,
				{
					assignmentId,
					title,
					platform,
					deadline,
				},
				getCommonOptions()
			)
			.then((res) => {
				const data = res.data;
				setPendingAssignments(data.pending_assignments);
				setOverdueAssignments(data.overdue_assignments);
				setCompletedAssignments(data.completed_assignments);
			})
			.catch((err) => {
				enqueueSnackbar(formatHttpApiError(err), { variant: "error" });
			});
	};

	return (
		<AssignmentContext.Provider
			value={{
				pending_assignments: pending_assignments,
				overdue_assignments: overdue_assignments,
				completed_assignments: completed_assignments,
				toggleComplete: toggleComplete,
				addAssignment: addAssignment,

				getAssignment: getAssignment,

				editAssignment: editAssignment,
			}}
		>
			{children}
		</AssignmentContext.Provider>
	);
}
