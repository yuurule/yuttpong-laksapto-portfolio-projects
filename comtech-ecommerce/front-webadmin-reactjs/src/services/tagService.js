import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getTags() {
  const getTagsAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/tag`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getTagsAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getTagsAPI);
}

export async function createTag(data) {
  const createTagAPI = (resolve, reject) => {
		let url = SERVER_API + "/api/tag/create";
		axiosInstance
			.post(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error createTagAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(createTagAPI);
}

export async function updateTag(id, data) {
  const updateTagAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/tag/${id}`;
		axiosInstance
			.put(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error updateTagAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(updateTagAPI);
}

export async function deleteTags(data) {
  const deleteTagsAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/tag/delete`;
		axiosInstance
			.delete(url, { data })
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error deleteTagsAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(deleteTagsAPI);
}

export async function getStatisticTags(paramsQuery) {
	const getStatisticTagsAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			orderBy,
			orderDir,
			search,
			productAmount
		} = paramsQuery;
		let url = SERVER_API + `/api/statistic/tags?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderDir=${orderDir}`;
		if(search) url += `&search=${search}`;
		if(productAmount) url += `&productAmount=${productAmount}`;

		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getStatisticTagsAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getStatisticTagsAPI);
}