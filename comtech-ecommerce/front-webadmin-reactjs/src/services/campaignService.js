import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getAllCampaign() {
  const getAllCampaignAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/campaign`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getAllCampaignAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getAllCampaignAPI);
}

export async function getOneCampaign(id) {
  const getOneCampaignAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/campaign/${id}`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getOneCampaignAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getOneCampaignAPI);
}

export async function createCampaign(data) {
  const createCampaignAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/campaign`;
		axiosInstance
			.post(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error createCampaignAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(createCampaignAPI);
}

export async function updateCampaign(id, data) {
  const updateCampaignAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/campaign/update/${id}`;
		axiosInstance
			.put(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error updateCampaignAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(updateCampaignAPI);
}

export async function activateCampaign(id, data) {
  const activateCampaignAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/campaign/activate/${id}`;
		axiosInstance
			.put(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error activateCampaignAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(activateCampaignAPI);
}

export async function deleteCampaigns(data) {
  const deleteCampaignsAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/campaign`;
		axiosInstance
			.delete(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error deleteCampaignsAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(deleteCampaignsAPI);
}

export async function createCampaignHistory(data) {
  const createCampaignHistoryAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/campaign/history`;
		axiosInstance
			.post(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error createCampaignHistoryAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(createCampaignHistoryAPI);
}