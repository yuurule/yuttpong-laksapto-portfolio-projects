import { SERVER_API } from './serviceConfig';
import axiosInstance from '../utils/axiosInstance';

export async function getBrands() {
  const getBrandsAPI = (resolve, reject) => {
		let url = SERVER_API + `/api/brand`;
		axiosInstance
			.get(url)
			.then((res) => {
				// console.log(res.data);
				resolve(res);
			})
			.catch((err) => {
				console.log(`Error getBrandsAPI: ${err}`);
				reject(err);
			});
	};

	return new Promise(getBrandsAPI);
}