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

export async function getStatisticCustomers(paramsQuery) {
	const getStatisticCustomersAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			orderBy,
			orderDir,
			search,
			totalExpense
		} = paramsQuery;
		let url = SERVER_API + `/api/statistic/customers?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderDir=${orderDir}`;
		if(search) url += `&search=${search}`;
		if(totalExpense) url += `&totalExpense=${totalExpense}`;

		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getStatisticCustomersAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getStatisticCustomersAPI);
}

export async function getSuspenseCustomers(paramsQuery) {
	const getSuspenseCustomersAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			orderBy,
			orderDir
		} = paramsQuery;
		let url = SERVER_API + `/api/suspense/customer?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderDir=${orderDir}`;

		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getSuspenseCustomersAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getSuspenseCustomersAPI);
}

export async function suspenseCustomers(customersId, userId) {
  const suspenseCustomersAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/suspense/customer`;

		const requestData = {
			customersId: customersId, 
			userId: userId
		}

		axiosInstance
			.delete(url, { data: requestData })
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error suspenseCustomersAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(suspenseCustomersAPI);
}

export async function getWishlistByCustomer(customerId, paramsQuery={}) {
  const getWishlistByCustomerAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			pagination,
			orderBy,
			orderDir
		} = paramsQuery;

		let url = SERVER_API + `/api/wishlistByCustomer/${customerId}?`;

		if(page) url += `page=${page}&`;
		if(pageSize) url += `pageSize=${pageSize}&`;
		if(pagination) url += `pagination=${pagination}&`;
		if(orderBy) url += `orderBy=${orderBy}&`;
		if(orderDir) url += `orderDir=${orderDir}&`;

		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getWishlistByCustomerAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getWishlistByCustomerAPI);
}