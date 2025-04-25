import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getAllStockAction(paramsQuery) {
  const getAllStockActionAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			pagination,
			orderBy,
			orderDir,
		} = paramsQuery;

		let url = SERVER_API + `/api/stock-action?page=${page}&pageSize=${pageSize}&pagination=${pagination}&orderBy=${orderBy}&orderDir=${orderDir}`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getAllStockActionAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getAllStockActionAPI);
}

export async function getOneStockAction(id) {
  const getOneStockActionAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/stock-action/${id}`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getOneStockActionAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getOneStockActionAPI);
}

export async function createStockAction(data) {
  const createStockActionAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/stock-action`;
		axiosInstance
			.post(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error createStockActionAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(createStockActionAPI);
}

export async function getAllStockSellAction(paramsQuery) {
  const getAllStockSellActionAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			pagination,
			orderBy,
			orderDir,
		} = paramsQuery;

		let url = SERVER_API + `/api/stock-sell-action?page=${page}&pageSize=${pageSize}&pagination=${pagination}&orderBy=${orderBy}&orderDir=${orderDir}`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getAllStockSellActionAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getAllStockSellActionAPI);
}