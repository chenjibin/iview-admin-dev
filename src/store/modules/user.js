import Cookies from 'js-cookie';
import store from '../index';
import axios from 'axios';

const user = {
    state: {
        userInfo: {}
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        logout () {
            axios.get('/login/logout').then((res) => {
                if (res.success) {
                    Cookies.remove('user');
                    Cookies.remove('userInfo');
                    Cookies.remove('password');
                    Cookies.remove('token');
                    store.commit('setPremissionMenu', []);
                    store.commit('clearAllTags');
                    window.location.reload();
                    // 恢复默认样式
                    let themeLink = document.querySelector('link[name="theme"]');
                    themeLink.setAttribute('href', '');
                    // 清空打开的页面等数据，但是保存主题数据
                    let theme = '';
                    if (localStorage.theme) {
                        theme = localStorage.theme;
                    }
                    localStorage.clear();
                    if (theme) {
                        localStorage.theme = theme;
                    }
                }
            });
        }
    }
};

export default user;
