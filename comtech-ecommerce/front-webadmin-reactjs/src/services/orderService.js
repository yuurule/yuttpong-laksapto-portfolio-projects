import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getOrders(paramsQuery) {
  const getAllOrderAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			pagination,
			orderBy,
			orderDir,
			search,
		} = paramsQuery;

		let url = SERVER_API + `/api/order?page=${page}&pageSize=${pageSize}&pagination=${pagination}&orderBy=${orderBy}&orderDir=${orderDir}`;
		if(search) url += `&search=${search}`;
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