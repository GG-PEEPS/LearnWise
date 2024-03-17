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
};

export const AssignmentContext = createContext<AssignmentContextType>({
	pending_assignments: [],
	overdue_assignments: [],
	completed_assignments: [],

	toggleComplete: () => {},
	addAssignment: () => {},
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

	return (
		<AssignmentContext.Provider
			value={{
				pending_assignments: pending_assignments,
				overdue_assignments: overdue_assignments,
				completed_assignments: completed_assignments,
				toggleComplete: toggleComplete,
				addAssignment: addAssignment,
			}}
		>
			{children}
		</AssignmentContext.Provider>
	);
}
