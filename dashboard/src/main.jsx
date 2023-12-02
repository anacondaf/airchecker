import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Dashboard.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Dashboard from "./Dashboard.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Dashboard />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
