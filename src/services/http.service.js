import Axios from 'axios'
import { userService } from './user/user.service.remote.js'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : '//localhost:3030/api/'


const axios = Axios.create({ withCredentials: true, baseURL: BASE_URL })
const axiosNoIntercept = Axios.create({ withCredentials: true, baseURL: BASE_URL })

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    const url = endpoint
    const params = (method === 'GET') ? data : null

    const options = { url, method, data, params }

    try {
        const res = await axios(options)
        return res.data
    } catch (err) {
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.dir(err)
        // if (err.response && err.response.status === 401) {
        //     sessionStorage.clear()
        //     window.location.assign('/')
        // }
        throw err
    }
}

let isRefreshing = false
let refreshSubscribers = []

function onRefreshed() {
    refreshSubscribers.forEach(callback => callback())
    refreshSubscribers = []
}

function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback)
}

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const refreshUrl = `${BASE_URL}auth/refresh`;

        if (status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes('/auth/refresh')) {
                //Refresh token failed or revoked. Logging out.
                isRefreshing = false
                await userService.logout();
                return Promise.reject(error);
            }

            originalRequest._retry = true

            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber(() => {
                        resolve(axios(originalRequest))
                    })
                })
            }

            isRefreshing = true

            //Access Token expired. Attempting to refresh...
            try {
                await _renewAccessToken();
                isRefreshing = false
                onRefreshed()
                //Token refreshed. Retrying original request...
                return axios(originalRequest);
            } catch (refreshErr) {
                //Failed to renew token. Logging out.
                isRefreshing = false
                await userService.logout();
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);


async function _renewAccessToken() {
    const res = await axiosNoIntercept.post('auth/refresh')
    return res.data
}