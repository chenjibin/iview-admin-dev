/**
 * Created by 陈继斌 on 2018/4/16.
 */
import store from '../index';
import axios from 'axios';

const knowledge = {
    state: {
        treeData: [],
        noImportantTreeData: [],
        keyword: '',
        cateId: '',
        cateName: '',
        topHeight: '1200px'
    },
    mutations: {
        getNoImportantTreeData(state) {
            axios.get('/knowledge/getMenuNoImportant').then((res) => {
                if (res.success) {
                    state.noImportantTreeData = [res.data];
                }
            });
        },
        getTreeData(state) {
            axios.get('/knowledge/getMenu').then((res) => {
                if (res.success) {
                    if (!res.data) {
                        state.treeData = [];
                    } else {
                        state.treeData = [res.data];
                    }
                }
            });
        },
        setKeyWord(state, keyword) {
            state.keyword = keyword;
            state.cateId = '';
            state.cateName = '';
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
