import axios from "axios";
import qs from "qs";
import { Modal } from "iview";
import Cookies from 'js-cookie';



const Axios = axios.create({
    baseURL: "/", // 因为我本地做了反向代理
    timeout: 10000,
    // responseType: "json",
    withCredentials: true, // 是否允许带cookie这些
    headers: {
        "Content-Type": "text/plain;charset=UTF-8"
    },
    // 请求URL中统一添加公共get参数数据，目前添加了token，userid
    params: {
        token: "",
        userid: ""
    }
});

//请求拦截器设置
Axios.interceptors.request.use(
    config => {
        // 弥补axios初始化获取不到cookies问题
        config.params.token = Cookies.get("token");
        config.params.userid = Cookies.get("userid");
        console.log('Axios.interceptors.request.use-config:', config);
        return config;
    },
    error => {
        console.log('Axios.interceptors.request.use-error:', error);
        return Promise.reject(error);
    }
);

//响应拦截器-主要提前处理返回结果错误
Axios.interceptors.response.use(
    res => {
        console.log('Axios.interceptors.response.use-res:', res);
        // 判断API接口状态约定
        if (res.data && res.data.returncode && res.data.returncode != 0) {
            Modal.error({
                title: '错误提示',
                content: res.data.data
            });
            return Promise.reject(res.data);
        }
        return res.data;
    },
    error => {
        console.log('Axios.interceptors.response.use-error:', error);
        return error;
    }
);

const fetch = (options) => {
    const { method = 'get', data, url, } = options
    switch (method.toLowerCase()) {
        case 'get':
            return Axios.get(`${url}${options.data ? `?${qs.stringify(options.data)}` : ''}`)
        case 'delete':
            return Axios.delete(url, { data })
        case 'head':
            return Axios.head(url, data)
        case 'post':
            return Axios.post(url, data)
        case 'put':
            return Axios.put(url, data)
        case 'patch':
            return Axios.patch(url, data)
        default:
            return Axios(options)
    }
}

export default function request(options) {
    return fetch(options).catch((error) => {
        console.log("error:", error);
    });
}