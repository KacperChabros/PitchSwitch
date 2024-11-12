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
import PlayerSearchPage from "../Pages/PlayerSearchPage/PlayerSearchPage";
import PlayerPage from "../Pages/PlayerPage/PlayerPage";
import TransferSearchPages from "../Pages/TransferSearchPage/TransferSearchPages";
import TransferPage from "../Pages/TransferPage/TransferPage";
import TransferRumourSearchPage from "../Pages/TransferRumourSearchPage/TransferRumourSearchPage";
import TransferRumourPage from "../Pages/TransferRumourPage/TransferRumourPage";

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
            {path: "playersearch", element: <ProtectedRoute><PlayerSearchPage/></ProtectedRoute>},
            {path: "player/:playerId", element: <ProtectedRoute><PlayerPage/></ProtectedRoute>},
            {path: "transfersearch", element: <ProtectedRoute><TransferSearchPages/></ProtectedRoute>},
            {path: "transfer/:transferId", element: <ProtectedRoute><TransferPage/></ProtectedRoute>},
            {path: "transferrumoursearch", element: <ProtectedRoute><TransferRumourSearchPage/></ProtectedRoute>},
            {path: "transferrumour/:transferRumourId", element: <ProtectedRoute><TransferRumourPage/></ProtectedRoute>},

            {path: "*", element: <NotFoundPage />},
        ]
    }
])