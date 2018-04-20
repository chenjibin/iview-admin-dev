<template>
    <div class="fs-article-index">
        <div class="tree" :class="{'show': treeShow}">
            <div class="btn" @click.stop="treeShow = !treeShow">{{treeShow ? '收起知识体系': '展开知识体系'}}</div>
            <p class="title">知识体系</p>
            <el-tree class="fs-tree"
                     :data="treeData"
                     :props="defaultProps"
                     node-key="id"
                     default-expand-all
                     highlight-current
                     @node-click="nodeClickHandler"
                     :expand-on-click-node="false"
                     ref="tree1">
            </el-tree>
        </div>
        <div class="main-inner">
            <transition name="route-fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>
<style lang="less">
    .fs-article-index {
        .tree{
            position: fixed;
            padding: 12px 0;
            z-index: 2;
            left: 0;
            top: 60px;
            width: 200px;
            background-color: #fff;
            transition: transform 0.3s;
            transform: translate3d(-100%,0,0);
            &.show {
                transform: translate3d(0,0,0);
            }
            .btn {
                position: absolute;
                right: -32px;
                top: 0;
                z-index: 100;
                width: 32px;
                background-color: #fff;
                padding: 8px;
                font-size: 14px;
                cursor: pointer;
                border-top-right-radius: 6px;
                border-bottom-right-radius: 6px;
            }
            .title {
                padding: 0 0 12px 12px;
                font-size: 18px;
                font-weight: 700;
                border-bottom: 1px solid #ddd;
            }
        }
        .main-inner {
            width: 1200px;
            margin: 0 auto;
        }
    }
</style>
<script>
    import FsCommentList from '@/baseComponents/fs-comment-list';
    export default {
        name: 'articleIndex',
        data () {
            return {
                treeShow: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            };
        },
        created() {
            this.$store.commit('getNoImportantTreeData');
        },
        computed: {
            treeData() {
                return this.$store.state.knowledge.noImportantTreeData;
            }
        },
        methods: {
            nodeClickHandler(data) {
                this.$store.commit('setCateId', data.id);
                this.$store.commit('setCateName', data.name);
                this.$store.commit('toListPage', this);
            }
        },
        components: {
            FsCommentList
        }
    };
</script>
