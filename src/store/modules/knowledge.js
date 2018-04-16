/**
 * Created by 陈继斌 on 2018/4/16.
 */
import store from '../index';
import axios from 'axios';

const knowledge = {
    state: {
        treeData: []
    },
    mutations: {
        getTreeData(state) {
            axios.get('/knowledge/getMenu').then((res) => {
                if (res.success) {
                    state.treeData = [res.data];
                }
            });
        }
    }
};

export default knowledge;
