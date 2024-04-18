import { Outlet, createBrowserRouter } from "react-router-dom";
import Login from "../screens/Auth/Login/Login";
import { RequireNotAuth } from "../helpers/RequireNotAuth";
import Register from "../screens/Auth/Register/Register";
import { RequireAuth } from "../helpers/RequireAuth";
import StudentBase from "../screens/Bases/StudentBase/StudentBase";
import Assignments from "../screens/Assignments/Assignments";
import AssignmentContextProvider from "../context/AssignmentContextProvider";
import Subjects from "../screens/Subjects/Subjects";
import SubjectContextProvider from "../context/SubjectsContextProvider";
import Subject from "../screens/Subjects/Subject/Subject";
import SubjectChat from "../screens/SubjectChat/SubjectChat";
import StudyContextProvider from "../context/StudyContextProvider";
import SubjectFAQ from "../screens/SubjectFAQ/SubjectFAQ";
import Calendar from "../screens/Calendar/Calendar";
import Dashboard from "../screens/Dashboard/Dashboard";
import TestSeries from "../screens/TestSeries/TestSeries";
import TestSeriesContextProvider from "../context/TestSeriesContextProvider";
import TestSeriesSubject from "../screens/TestSeries/TestSeriesSubject/TestSeriesSubject";
import TestSeriesPYQ from "../screens/TestSeries/TestSeriesPYQ/TestSeriesPYQ";
import Pomodoro from "../screens/Pomodorotimer/Pomodoro";

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
						path: "/dashboard",
						element: (
							<AssignmentContextProvider>
								<SubjectContextProvider>
									<Dashboard />
								</SubjectContextProvider>
							</AssignmentContextProvider>
						),
					},
					{
						path: "/calendar",
						element: <Calendar />,
					},
					{
						path: "/pomodorotimer",
						element: <Pomodoro />,
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
					{
						path: "/subjects/:subjectId",
						element: (
							<StudyContextProvider>
								<Outlet />
							</StudyContextProvider>
						),
						children: [
							{
								path: "/subjects/:subjectId/chat",
								element: <SubjectChat />,
							},
							{
								path: "/subjects/:subjectId/faq",
								element: <SubjectFAQ />,
							},
							{
								path: "/subjects/:subjectId",
								element: <Subject />,
							},
						],
					},
					{
						path: "/test-series",
						element: (
							<TestSeriesContextProvider>
								<Outlet />
							</TestSeriesContextProvider>
						),
						children: [
							{ path: "/test-series", element: <TestSeries /> },
							{
								path: "/test-series/:subjectId",
								element: <TestSeriesSubject />,
							},
							{
								path:"/test-series/:subjectId/previous-year-questions/:year",
								element:<TestSeriesPYQ/>
							}
						],
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
