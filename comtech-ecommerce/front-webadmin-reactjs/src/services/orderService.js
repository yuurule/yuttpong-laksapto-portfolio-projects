import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getAllOrder() {
  const getAllOrderAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/order`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getAllOrderAPI: ${err}`);
				reject(err);
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
				console.log(`Error getOneOrderAPI: ${err}`);
				reject(err);
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
				console.log(`Error updateOrderDeliveryAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(updateOrderDeliveryAPI);
}