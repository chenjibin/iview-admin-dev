/**
 * Created by 陈继斌 on 2017/12/29.
 */
import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = '/oa';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(config => {
    // Do something before request is sent
    // config.withCredentials = true  // 需要跨域打开此配置
    // post提交 data存在 并且 data不是FormData对象时对数据进行json化处理
    console.log(config)
    if (config.method === 'post' && config.data && config.data.constructor !== FormData) {
        config.data = qs.stringify(config.data);
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
}, function(error) {
    // Do something with request error
    return Promise.reject(error);
})

// Add a response interceptor
axios.interceptors.response.use(response => {
    // Do something with response data
    return response.data;
}, function(error) {
    // Do something with response error
    return Promise.reject(error);
})

export default axios;
