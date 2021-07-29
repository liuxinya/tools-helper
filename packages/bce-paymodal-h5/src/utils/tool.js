import axios from 'axios';

import {Toast as toast} from 'vant';

const csrfToken = getCookie('bce-user-info');

const instance = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Request-By': 'VueApplication',
        'csrfToken': csrfToken ? csrfToken.slice(1, -1) : '', // user-info cookie 两边有单引号
        'toast': true,
    },
});

instance.interceptors.request.use((config) => {
    if (config.params) {
        Object.assign(config.params, {locale: 'zh-cn'});
    } else {
        config.params = {locale: 'zh-cn'};
    }

    const headers = config.headers;
    if (headers && headers.region) {
        config.headers['X-Region'] = headers.region;
    }

    if (!config.silence) {
        toast.loading({
            duration: 0,
            forbidClick: true,
            loadingType: 'spinner',
        });
    }
    return config;
});

instance.interceptors.response.use(response => {
    toast.clear();
    if (response.data.success === false || response.data.success === 'false') {
        const errorStr = JSON.stringify(response.data.message);
        if (instance.defaults.headers && instance.defaults.headers.toast === true) {
            toast({
                type: 'fail',
                message: errorStr,
                duration: 2000,
            });
        }

        return Promise.reject(response.data.message);
    }
    return response && response.data;
}, error => {
    toast.fail(error.message);
    return Promise.reject(error);
});

function getCookie(name) {
    let match = new RegExp('(^|;\\s*)(' + name + ')=([^;]*)').exec(document.cookie);
    return (match ? decodeURIComponent(match[3]) : null);
}
export {
    instance as http,
    getCookie
};
