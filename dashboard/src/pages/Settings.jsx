import { useState, useEffect } from "react";
import "../styles/settings.style.css";
import { toast } from "react-toastify";
import { Axios } from "../config/axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Settings() {
	const [email, setEmail] = useState("");
	const [subscriberList, setSubscriberList] = useState([]);

	const handleEmailEnter = (e) => {
		setEmail(e.target.value);
	};

	const getSubscriberList = async () => {
		try {
			const subscribers = await Axios.getSubscribersHandler();
			console.log(`Fetch... ${import.meta.env.VITE_API_URL}`);

			setSubscriberList(subscribers.data.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleEmailOnKeyDown = async (e) => {
		if (e.key === "Enter") {
			try {
				const successResponse = await Axios.insertSubscriberHandler(email);

				toast.success(`${successResponse.data.message}`, {
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});

				getSubscriberList();
			} catch (error) {
				console.log(error);

				toast.error(
					`${
						error.response.data.validation
							? error.response.data.validation.body.message
							: error.response.data.message
					}`,
					{
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					}
				);
			}
		}
	};

	const handleDeleteSubscriber = async (e) => {
		try {
			const id = e.currentTarget.parentNode.getAttribute("id");
			const response = await Axios.deleteSubscribersByIdHandler(id);

			toast.success(
				`Delete subscriber with email ${response.data.data.email}`,
				{
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				}
			);

			getSubscriberList();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getSubscriberList();
	}, []);

	return (
		<>
			<div className="settings">
				<h1>Settings</h1>
				<div className="settings_container">
					<div className="subscribe setting_item">
						<div className="left_panel">
							<h4>Subscribe Email Alert</h4>

							<div className="divider"></div>

							<input
								placeholder="example@gmail.com"
								onChange={(e) => {
									handleEmailEnter(e);
								}}
								onKeyDown={(e) => {
									handleEmailOnKeyDown(e);
								}}
								value={email}
							/>
						</div>
					</div>

					{subscriberList.map((v, i) => {
						return (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									margin: "6px 0",
								}}
								id={v._id}
								key={i}
							>
								<p>{v.email}</p>
								<FontAwesomeIcon
									style={{ marginLeft: "8px", color: "red", cursor: "pointer" }}
									icon={faTrash}
									onClick={(e) => handleDeleteSubscriber(e)}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default Settings;
