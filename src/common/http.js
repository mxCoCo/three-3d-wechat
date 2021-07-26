import axios from 'axios';
import {
    Toast
} from "antd-mobile";
import {BASE_URL} from './config.js';

// 请求超时时间
axios.defaults.timeout = 20 * 1000;
axios.defaults.baseURL = BASE_URL;
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;
axios.defaults.headers = {
    'Content-Type': 'application/json;charset=UTF-8',
}

// 请求拦截器
axios.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token');
        let loginResult = {
            token: "",
        };
        if (token) {
            loginResult = JSON.parse(token);
        }

        if (config.headers && config.headers["Content-Type"]) {
            config.headers = {
                'x-auth-token': loginResult.token || '',
                'Content-Type': config.headers["Content-Type"],
            };
        } else {
            config.headers = {
                'x-auth-token': loginResult.token || '',
                'Content-Type': 'application/json',
            };
        }

        return config;
    },
    error => {
        Toast.fail('请求超时!', 1);
        return Promise.error(error);
    })

// 响应拦截器
axios.interceptors.response.use(
    response => {
        // Toast.clear();
        const {data} = response;

        if (response.status === 200) {
            if (data && data.code == 900) {
                Toast.fail("用户登录超时,重新登录", 1);
                sessionStorage.clear();
                localStorage.clear();
                window.location.replace("/login");
                return;
            }
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        if (error.code === "ECONNABORTED" && error.message.indexOf("timeout") !== -1) {
            Toast.fail('请求超时!', 1);
        }
        switch (error.response.status) {
            case 404:
                Toast.fail('网络请求不存在!', 1);
                break;
            default:
                Toast.fail(error.message, 1);
                break;
        }
        return Promise.reject(error.response);
    }
);

export function postFile(url, params) {
    return new Promise((resolve, reject) => {
        // document.getElementById('edc-loading').style.display = '';
        axios.post(url, params ? params : {}, {
            headers: {"Content-Type": "multipart/form-data"},
        })
            .then(res => {
                // document.getElementById('edc-loading').style.display = 'none';
                resolve(res.data);
            })
            .catch(err => {
                // document.getElementById('edc-loading').style.display = 'none';
                reject(err)
            })
    });
}

export function post(url, params, headers) {

    return new Promise((resolve, reject) => {
        // document.getElementById('edc-loading').style.display = '';
        axios.post(url, params ? JSON.stringify(params) : {}, {
            headers
        })
            .then(res => {
                // document.getElementById('edc-loading').style.display = 'none';
                resolve(res.data);
            })
            .catch(err => {
                // document.getElementById('edc-loading').style.display = 'none';
                reject(err)
            })
    });
}

export function get(url, params, headers) {
    return new Promise((resolve, reject) => {
        // document.getElementById('edc-loading').style.display = '';
        axios.get(url, {
            params,
            headers
        })
            .then(res => {
                // document.getElementById('edc-loading').style.display = 'none';
                resolve(res.data);
            })
            .catch(err => {
                // document.getElementById('edc-loading').style.display = 'none';
                reject(err)
            })
    });
}

export function patch(url, params, headers) {
    return new Promise((resolve, reject) => {
        // document.getElementById('edc-loading').style.display = '';
        axios.patch(url, {
            params,
            headers
        })
            .then(res => {
                // document.getElementById('edc-loading').style.display = 'none';
                resolve(res.data);
            })
            .catch(err => {
                // document.getElementById('edc-loading').style.display = 'none';
                reject(err)
            })
    });
}