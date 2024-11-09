import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import StartPage from "../Pages/StartPage/StartPage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ClubSearchPage from "../Pages/ClubSearchPage/ClubSearchPage";
import ClubPage from "../Pages/ClubPage/ClubPage";
import NotFoundPage from "../Pages/NotFoundPage/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children:[
            {path: "", element: <StartPage/>},
            {path: "login", element: <PublicRoute><LoginPage/></PublicRoute>},
            {path: "register", element: <PublicRoute><RegisterPage/></PublicRoute>},
            {path: "home", element: <ProtectedRoute><HomePage/></ProtectedRoute>},
            {path: "clubsearch", element: <ProtectedRoute><ClubSearchPage/></ProtectedRoute>},
            {path: "club/:clubId", element: <ProtectedRoute><ClubPage/></ProtectedRoute>},
            {path: "*", element: <NotFoundPage />},
        ]
    }
])