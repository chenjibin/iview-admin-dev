/**
 * Created by 陈继斌 on 2018/4/23.
 */

module.exports = file => () => import('@/pages/' + file + '/index.vue');
