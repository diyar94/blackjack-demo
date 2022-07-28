import request from 'umi-request';

const url = '/api';

export const endpoints = {
	sit: `${url}/sit`,
	deal: `${url}/deal`,
	turn: `${url}/turn`,
	stand: `${url}/stand`

};

// export const apiGet = (apiUrl: string, options?: RequestOptionsInit | undefined) => request.post(apiUrl, options);
export const apiPost = (apiUrl, options) => request.post(apiUrl, options);
