import { createBrowserRouter } from "react-router-dom";
import Login from "../screens/Auth/Login/Login";
import { RequireNotAuth } from "../helpers/RequireNotAuth";
import Register from "../screens/Auth/Register/Register";
import { RequireAuth } from "../helpers/RequireAuth";

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter([
    {
        path: "/", element: <RequireAuth />, children: [
            { path: "/", element: <div>Home</div> }
        ]
    },
    {
        path: "/",
        element: <RequireNotAuth />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> }
        ]
    }
])
