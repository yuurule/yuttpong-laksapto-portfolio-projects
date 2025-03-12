import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getTags() {
  const getTagsAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/tag`;
		axiosInstance
			.get(url)
			.then((res) => {
				// console.log(res.data);
				resolve(res.data);
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
				// console.log(res.data);
				resolve(res.data);
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
				// console.log(res.data);
				resolve(res.data);
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
				// console.log(res.data);
				resolve(res.data);
			})
			.catch((err) => {
				console.log(`Error deleteTagsAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(deleteTagsAPI);
}