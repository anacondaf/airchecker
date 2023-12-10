import { useState } from "react";
import "../styles/settings.style.css";
import { Checkbox, Select } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { Axios } from '../config/axios';

const friendOptions = [
  {
    key: 'Jenny Hess',
    text: 'Jenny Hess',
    value: 'Jenny Hess',
    image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
  },
  {
    key: 'Elliot Fu',
    text: 'Elliot Fu',
    value: 'Elliot Fu',
    image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
  },
  {
    key: 'Stevie Feliciano',
    text: 'Stevie Feliciano',
    value: 'Stevie Feliciano',
    image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
  },
  {
    key: 'Christian',
    text: 'Christian',
    value: 'Christian',
    image: { avatar: true, src: '/images/avatar/small/christian.jpg' },
  },
  {
    key: 'Matt',
    text: 'Matt',
    value: 'Matt',
    image: { avatar: true, src: '/images/avatar/small/matt.jpg' },
  },
  {
    key: 'Justen Kitsune',
    text: 'Justen Kitsune',
    value: 'Justen Kitsune',
    image: { avatar: true, src: '/images/avatar/small/justen.jpg' },
  },
]

function Settings() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState({
    isError: false,
    msg: ""
  });

  const handleEmailEnter = (e) => {
    setEmail(e.target.value);
  }

  const handleEmailOnKeyDown = async (e) => {
	
    if (e.key === 'Enter') {
		try {
			const successResponse = await Axios.insertSubscriberHandler(email);

			toast.success(`${successResponse.data.message}`, {
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		
		} catch (error) {
			console.log(error);

			toast.error(`${error.response.data.validation ? error.response.data.validation.body.message : error.response.data.message}`, {
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
    }
  }

	return (
		<>
			<div className="settings">
				<h1>Settings</h1>
				<div className="settings_container">
					<div className="setting_item">

						<div className="left_panel">
							<h4>AQI Level Alert</h4>
							<div className="divider"></div>
							<Select 
							placeholder='Select AQI Level' 
							options={friendOptions} />
						</div>
					</div>

					<div className="subscribe setting_item">

						<div className="left_panel">
							<h4>Subscribe Email Alert</h4>

							<div className="divider"></div>

							<input 
							placeholder="example@gmail.com" 
							onChange={(e) => {handleEmailEnter(e)}}
							onKeyDown={(e) => {handleEmailOnKeyDown(e)}}
							value={email} />
						</div>

						<Checkbox toggle />

					</div>

					<div className="setting_item">

						<div className="left_panel">
							<h4>Receive Notifications</h4>

							<div className="divider"></div>

							<p>Receive notification after an hour.</p>
						</div>

						<Checkbox toggle />

					</div>
				</div>
			</div>

			
		</>
		
	);
}

export default Settings;
