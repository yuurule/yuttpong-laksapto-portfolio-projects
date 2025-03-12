import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getAllProduct() {
  const getAllProductAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/product`;
		axiosInstance
			.get(url)
			.then((res) => {
				// console.log(res.data);
				resolve(res.data);
			})
			.catch((err) => {
				console.log(`Error getAllProductAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getAllProductAPI);
}

export async function getOneProduct(id) {
  const getOneProductAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/product/${id}`;
		axiosInstance
			.get(url)
			.then((res) => {
				// console.log(res.data);
				resolve(res.data);
			})
			.catch((err) => {
				console.log(`Error getOneProductAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getOneProductAPI);
}

export async function addNewProduct(data) {
  const addNewProductAPI = (resolve, reject) => {
		let url = SERVER_API + "/api/product";
		axiosInstance
			.post(url, data)
			.then((res) => {
				// console.log(res.data);
				resolve(res.data);
			})
			.catch((err) => {
				console.log(`Error addNewProductAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(addNewProductAPI);
}

export async function updateProduct(id, data) {
  const updateProductAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/product/${id}`;
		axiosInstance
			.put(url, data)
			.then((res) => {
				// console.log(res.data);
				resolve(res.data);
			})
			.catch((err) => {
				console.log(`Error updateProductAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(updateProductAPI);
}

export async function moveProductsToTrash(data) {
  const moveProductsToTrashAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/category/delete`;
		axiosInstance
			.delete(url, { data })
			.then((res) => {
				// console.log(res.data);
				resolve(res.data);
			})
			.catch((err) => {
				console.log(`Error moveProductsToTrashAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(moveProductsToTrashAPI);
}