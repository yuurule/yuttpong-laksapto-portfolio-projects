import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getCustomers() {
  const getCustomersAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/customer`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getCustomersAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getCustomersAPI);
}

export async function getOneCustomer(customerId) {
  const getOneCustomerAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/customer/${customerId}`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getOneCustomerAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getOneCustomerAPI);
}