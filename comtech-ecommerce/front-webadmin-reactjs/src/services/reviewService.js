import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getAllReview() {
  const getAllReviewAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/customer/review`;
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

export async function getReviewsByCustomer(customerId) {
  const getReviewsByCustomerAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/customer/review/${customerId}`;
		axiosInstance
			.get(url)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getReviewsByCustomerAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getReviewsByCustomerAPI);
}

export async function approveReview(reviewId, data) {
  const approveReviewAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/customer/review/approve/${reviewId}`;
		axiosInstance
			.put(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error approveReviewAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(approveReviewAPI);
}