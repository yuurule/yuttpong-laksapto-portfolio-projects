import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getAllProduct(paramsQuery) {
  const getAllProductAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			noPagination,
			brands,
			categories,
			tags,
			search,
			orderBy,
			orderDir
		} = paramsQuery;

		let url = SERVER_API + `/api/product?page=${page}&pageSize=${pageSize}&noPagination=${noPagination}&brands=${brands}&categories=${categories}&tags=${tags}&orderBy=${orderBy}&orderDir=${orderDir}`;
		if(search) {
			url += `&search=${search}`;
		}
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getAllProductAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
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
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getOneProductAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
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
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error addNewProductAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
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
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error updateProductAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
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
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error moveProductsToTrashAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(moveProductsToTrashAPI);
}

// Statistics
export async function getStatisticProduct(paramsQuery) {
	const getStatisticProductAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			orderBy,
			orderDir,
			search,
			inStock,
			sale,
			totalSale
		} = paramsQuery;

		let url = SERVER_API + `/api/statistic/products?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderDir=${orderDir}`;
		if(search) url += `&search=${search}`;
		if(inStock) url += `&inStock=${inStock}`;
		if(sale) url += `&sale=${sale}`;
		if(totalSale) url += `&totalSale=${totalSale}`;

		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getStatisticProductAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getStatisticProductAPI);
}