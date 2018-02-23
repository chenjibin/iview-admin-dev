import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import store from '../store';
import {routers} from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (to.name === 'guest') {
        next();
    } else if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            });
        } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
            Util.title();
            next({
                name: 'home_index'
            });
        } else if (Cookies.get('user') && to.name !== 'login') {
            if (!store.state.app.premissionMenu.length) {
                Util.getPermissionData().then((data) => {
                    let userInfo = JSON.parse(Cookies.get('userInfo'));
                    store.commit('setUserInfo', userInfo);
                    Util.initMenu(router, store, data);
                    Util.toDefaultPage([...routers, ...store.state.app.premissionMenu], to.name, router, next);
                });
            } else {
                Util.toDefaultPage([...routers, ...store.state.app.premissionMenu], to.name, router, next);
            }
        } else {
            Util.toDefaultPage(routers, to.name, router, next);
        }
    }
});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
