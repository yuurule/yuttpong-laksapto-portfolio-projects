import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getOrders(paramsQuery={}) {
  const getAllOrderAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			pagination,
			orderBy,
			orderDir,
			search,
			paymentStatus,
			deliveryStatus,
			startDate,
			endDate
		} = paramsQuery;

		let url = SERVER_API + `/api/order?`;
		
		if(page) url += `page=${page}&`;
		if(pageSize) url += `pageSize=${pageSize}&`;
		if(pagination) url += `pagination=${pagination}&`;
		if(orderBy) url += `orderBy=${orderBy}&`;
		if(orderDir) url += `orderDir=${orderDir}&`;
		if(search) url += `search=${search}&`;
		if(paymentStatus) url += `paymentStatus=${paymentStatus}&`;
		if(deliveryStatus) url += `deliveryStatus=${deliveryStatus}&`;
		if(startDate) url += `startDate=${startDate}&`;
		if(endDate) url += `endDate=${endDate}&`;
		
		//console.log(url)

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