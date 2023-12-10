import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosConfig = {
  baseURL: API_URL,
  
};

const instance = axios.create(axiosConfig);

instance.insertSubscriberHandler = async (email) => {
	return (await instance.post('subscribers', 
	{
		email: email
	},
	{
		headers: {
			'Content-Type': 'application/json'
		}
	}))
}


export const Axios = instance;