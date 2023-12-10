import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "semantic-ui-css/semantic.min.css";
import 'react-toastify/dist/ReactToastify.css';

import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom";

import Root from "./pages/Root";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "dashboard",
				element: <Dashboard />,
			},
			{
				path: "settings",
				element: <Settings />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
