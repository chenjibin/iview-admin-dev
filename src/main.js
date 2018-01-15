import Vue from 'vue';
import iView from 'iview';
import {Tree, Cascader} from 'element-ui';
import {router} from './router/index';
// import {appRouter, page404} from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import util from '@/libs/util';
import request from './libs/request';
import Cookies from 'js-cookie';

Vue.use(VueI18n);
Vue.use(iView);
Vue.use(Tree);
Vue.use(Cascader);
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
                this.$http.get('/jurisdiction/getMySystemMenu').then((res) => {
                    resolve(res.date);
                });
            });
        }
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
    },
    created () {
        if (Cookies.get('token')) {
            this.getPermissionData().then((data) => {
                util.initMenu(this, data);
            });
        } else {
            this.$router.replace({name: 'login'});
        }
    }
});
