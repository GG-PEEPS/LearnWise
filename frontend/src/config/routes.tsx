import { createBrowserRouter } from "react-router-dom";
import Login from "../screens/Auth/Login/Login";
import { RequireNotAuth } from "../helpers/RequireNotAuth";
import Register from "../screens/Auth/Register/Register";
import { RequireAuth } from "../helpers/RequireAuth";
import StudentBase from "../screens/Bases/StudentBase/StudentBase";
import Assignments from "../screens/Assignments/Assignments";
import AssignmentContextProvider from "../context/AssignmentContextProvider";
import Subjects from "../screens/Subjects/Subjects";
import SubjectContextProvider from "../context/SubjectContextProvider";

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter([
	{
		path: "/",
		element: <RequireAuth />,
		children: [
			{
				path: "/",
				element: <StudentBase />,
				children: [
					{
						path: "/",
						element: <div>Dashboard</div>,
					},
					{
						path: "/assignments",
						element: (
							<AssignmentContextProvider>
								<Assignments />
							</AssignmentContextProvider>
						),
					},
					{
						path: "/subjects",
						element: (
							<SubjectContextProvider>
								<Subjects />
							</SubjectContextProvider>
						),
					},
				],
			},
		],
	},
	{
		path: "/",
		element: <RequireNotAuth />,
		children: [
			{ path: "/login", element: <Login /> },
			{ path: "/register", element: <Register /> },
		],
	},
]);
