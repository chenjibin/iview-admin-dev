<template>
    <div class="fs-article-index">
        <div>
            <div class="tooltop">
                <div class="tooltop-main">
                    <h1>天马知识库</h1>

                </div>
            </div>
            <div class="tree">
                <el-tree class="fs-tree"
                         :data="treeData"
                         :props="defaultProps"
                         node-key="id"
                         default-expand-all
                         highlight-current
                         :expand-on-click-node="false"
                         ref="tree1">
                </el-tree>
            </div>
            <div class="main">
                <div class="main-inner">
                    <Row :gutter="10">
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>
                    </Row>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    .fs-article-index {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .tree{
            position: absolute;
            padding: 12px 0;
            z-index: 2;
            left: 0;
            top: 60px;
            width: 200px;
            background-color: #fff;
        }
        .tooltop {
            position: absolute;
            z-index: 1;
            left: 0;
            width: 100%;
            top: 0;
            height: 52px;
            background-color: #fff;
            &-main {
                width: 1200px;
                margin: 0 auto;
            }
        }
        .main {
            position: absolute;
            z-index: 1;
            left: 0;
            top: 60px;
            right: 0;
            bottom: 0;
            overflow: auto;
            &-inner {
                width: 1200px;
                margin: 0 auto;
            }
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
        components: {
            FsCommentList
        }
    };
</script>
