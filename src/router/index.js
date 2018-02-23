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
    if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        console.log('11111');
        if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
            console.log('22222');
            next({
                name: 'login'
            });
        } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
            Util.title();
            console.log('33333');
            next({
                name: 'home_index'
            });
        } else if (Cookies.get('user') && to.name !== 'login') {
            console.log('44444');
            if (!store.state.app.premissionMenu.length) {
                console.log('55555');
                Util.getPermissionData().then((data) => {
                    let userInfo = JSON.parse(Cookies.get('userInfo'));
                    store.commit('setUserInfo', userInfo);
                    Util.initMenu(router, store, data);
                    Util.toDefaultPage([...routers, ...store.state.app.premissionMenu], to.name, router, next);
                });
            } else {
                console.log('666666');
                Util.toDefaultPage([...routers, ...store.state.app.premissionMenu], to.name, router, next);
            }
        } else {
            console.log('77777');
            Util.toDefaultPage(routers, to.name, router, next);
        }
    }
});

router.afterEach((to) => {
    console.log(to);
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
