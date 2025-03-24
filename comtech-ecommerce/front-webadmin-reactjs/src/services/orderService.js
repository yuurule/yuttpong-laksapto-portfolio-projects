import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getOrders() {
  const getAllOrderAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/order`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getAllOrderAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getAllOrderAPI);
}

export async function getOneOrder(orderId) {
  const getOneOrderAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/order/${orderId}`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getOneOrderAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getOneOrderAPI);
}

export async function updateOrderDelivery(orderId, data) {
  const updateOrderDeliveryAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/order/${orderId}/delivery`;
		axiosInstance
			.put(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error updateOrderDeliveryAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(updateOrderDeliveryAPI);
}