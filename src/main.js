import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter, page404} from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
// import util from '@/libs/util';
import request from './libs/request';
import Cookies from 'js-cookie';

Vue.use(VueI18n);
Vue.use(iView);
Vue.prototype.$http = request;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    methods: {
        getPermissionData() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(appRouter);
                }, 500);
            });
        }
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        // this.$store.commit('updateMenulist');
        // iview-admin检查更新
        // util.checkUpdate(this);
    },
    created () {
        if (Cookies.get('token')) {
            this.getPermissionData().then((data) => {
                let aa = data.concat([page404]);
                this.$store.commit('setPremissionMenu', data);
                this.$router.addRoutes(aa);
                let tagsList = [];
                data.map((item) => {
                    if (item.children.length <= 1) {
                        tagsList.push(item.children[0]);
                    } else {
                        tagsList.push(...item.children);
                    }
                });
                this.$store.commit('setTagsList', tagsList);
                this.$store.commit('updateMenulist');
            });
        } else {
            this.$router.replace({name: 'login'});
        }
    }
});
