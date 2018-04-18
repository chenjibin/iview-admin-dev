/**
 * Created by 陈继斌 on 2018/4/16.
 */
import store from '../index';
import axios from 'axios';

const knowledge = {
    state: {
        treeData: [],
        keyword: '',
        cateId: '',
        cateName: '',
        topHeight: '1200px'
    },
    mutations: {
        getTreeData(state) {
            axios.get('/knowledge/getMenu').then((res) => {
                if (res.success) {
                    state.treeData = [res.data];
                }
            });
        },
        setKeyWord(state, keyword) {
            state.keyword = keyword;
        },
        setCateId(state, cateId) {
            state.cateId = cateId;
        },
        setCateName(state, cateName) {
            state.cateName = cateName;
        },
        setToHeight(state, height) {
            state.topHeight = height;
        },
        toListPage(state, vm) {
            let params = {};
            params.name = 'articleList';
            params.query = {cateId: state.cateId, cateName: state.cateName, keyword: state.keyword};
            vm.$router.push(params);
        }
    }
};

export default knowledge;
