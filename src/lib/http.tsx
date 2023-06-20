import axios from "axios";
import config from "../config";

function requestHeaders() {
	const defaultHeaders = {
		"Content-Type": "application/json",
	};

	return defaultHeaders;
}


function post(url: string, data: any, headerConfig?: object) {
	const headers = requestHeaders();
	if (headerConfig) { Object.assign(headers, headerConfig); }

	return axios({method: "post", url: `${config.API_URL}/${url}`, data, headers})
		.then(res => res.data)
		.catch(function (error) {
			console.log(error);
		});
}

function get(url: string, params: any) {
	const headers = requestHeaders();
	return axios({method: "get", url: `${config.API_URL}/${url}`, params, headers})
		.then(res => res.data)
		.catch(function (error) {
			console.log(error);
		});		
}

function put(url: string, data: any) {
	const headers = requestHeaders();
	return axios({method: "put", url: `${config.API_URL}/${url}`, data, headers})
		.then(res => res.data)
		.catch(function (error) {
			console.log(error);
		});
}

function deleteRequest(url: string, params: any) {
	const headers = requestHeaders();
	return axios({method: "delete", url: `${config.API_URL}/${url}`, params, headers})
		.then(res => res.data)
		.catch(function (error) {
			console.log(error);
		});
}

export default {
	post: post,
	get: get,
	put: put,
	delete: deleteRequest
};
