import Vue from 'vue';
import iView from 'iview';
import { Tree, Cascader, Checkbox } from 'element-ui';
import { router } from './router/index';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import request from './libs/request';
import Cookies from 'js-cookie';

Vue.use(VueI18n);
Vue.use(iView);
Vue.use(Tree);
Vue.use(Cascader);
Vue.use(Checkbox);
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
    },
    mounted() {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
    },
    created() {
    }
});
