import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getCategories() {
  const getCategoryAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/category`;
		axiosInstance
			.get(url)
			.then((res) => {
				// console.log(res.data);
				resolve(res.data);
			})
			.catch((err) => {
				console.log(`Error getCategoryAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getCategoryAPI);
}

export async function createCategory(data) {
  const createCategoryAPI = (resolve, reject) => {
		let url = SERVER_API + "/api/category/create";
		axiosInstance
			.post(url, data)
			.then((res) => {
				// console.log(res.data);
				resolve(res.data);
			})
			.catch((err) => {
				console.log(`Error createCategoryAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(createCategoryAPI);
}

export async function updateCategory(id, data) {
  const updateCategoryAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/category/${id}`;
		axiosInstance
			.put(url, data)
			.then((res) => {
				// console.log(res.data);
				resolve(res.data);
			})
			.catch((err) => {
				console.log(`Error updateCategoryAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(updateCategoryAPI);
}
