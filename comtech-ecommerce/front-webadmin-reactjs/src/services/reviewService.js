import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getReviews() {
  const getAllReviewAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/review`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getAllReviewAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getAllReviewAPI);
}

export async function getReviewsByCustomer(customerId) {
  const getReviewsByCustomerAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/review/${customerId}`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getReviewsByCustomerAPI: ${err.message} ${err.response.data.MESSAGE}`);
				reject(`${err.message} ${err.response.data.MESSAGE}`);
			});
	};

	return new Promise(getReviewsByCustomerAPI);
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