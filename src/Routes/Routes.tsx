import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import StartPage from "../Pages/StartPage/StartPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children:[
            {path: "", element: <StartPage/>},
            {path: "home", element: <HomePage/>}
        ]
    }
])