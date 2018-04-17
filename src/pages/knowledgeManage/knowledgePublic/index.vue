<template>
    <div class="fs-article-index">
        <div class="tree">
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
            <router-view></router-view>
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
                img: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
                name: '大田集',
                commentContent: '😂 去年重构一个老项目，想用babel来搞，被babel文档虐得死去活来，最后还是看不懂',
                commentTime: '7天前',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            };
        },
        created() {
            this.$store.commit('getTreeData');
        },
        computed: {
            treeData() {
                return this.$store.state.knowledge.treeData;
            }
        },
        methods: {
            nodeClickHandler() {
            }
        },
        components: {
            FsCommentList
        }
    };
</script>
