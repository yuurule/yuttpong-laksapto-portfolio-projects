import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getReviews(paramsQuery) {
  const getAllReviewAPI = (resolve, reject) => {
		const {
			page,
			pageSize,
			pagination,
			orderBy,
			orderDir,
			waitApproved
		} = paramsQuery;

		let url = SERVER_API + `/api/review?page=${page}&pageSize=${pageSize}&pagination=${pagination}&orderBy=${orderBy}&orderDir=${orderDir}`;
		if(waitApproved) {
			url += `&waitApproved=${waitApproved}`;
		}
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getAllReviewAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getAllReviewAPI);
}

export async function getReviewsByProduct(productId) {
  const getReviewsByProductAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/reviewByProduct/${productId}`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getReviewsByProductAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getReviewsByProductAPI);
}

export async function approveReview(reviewId, data) {
  const approveReviewAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/review/approve/${reviewId}`;

		const requestData = {
			approve: data
		}

		axiosInstance
			.put(url, requestData)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error approveReviewAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(approveReviewAPI);
}