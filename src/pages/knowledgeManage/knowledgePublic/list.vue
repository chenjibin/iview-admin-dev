<template>
    <div class="article-list">
        <Card>
            <h2 class="cate-title">{{cateName}}<span v-if="pageData.totalCount">(共{{pageData.totalCount}}篇)</span></h2>
            <div class="list-item-block"
                 @click.stop="toArticlePage(item.id)"
                 v-for="item,index in pageData.list"
                 :key="'list-' + index">
                <div class="left">
                    <div class="fs-auto-img">
                        <img :src="item.file_path" />
                    </div>
                </div>
                <div class="right">
                    <div class="article-title">{{item.share_item}}</div>
                    <div class="article-info">
                        <div class="author">
                            <Avatar :src="item.headimagepath"  size="small"/>
                            <span style="margin-left: 2px;">{{item.insert_username}}</span>
                        </div>
                        <div>{{item.menuname}}</div>
                        <div>点赞{{item.thumb_up_times}}</div>
                        <div>评论{{item.share_comment_times}}</div>
                    </div>
                    <div class="article-desc">{{item.share_detail | deleteTag}}</div>
                </div>
            </div>
            <Spin size="large" fix v-if="tableLoading"></Spin>
            <div class="no-result-block" v-if="!pageData.totalCount && !tableLoading">
                <img src="../../../images/fail_pic.png" />
                <p class="info">暂无相关知识</p>
            </div>
            <Page :total="pageData.totalCount"
                  :current.sync="pageData.page"
                  :page-size="pageData.pageSize"
                  @on-change="getArticleList"
                  show-total
                  v-if="pageData.totalCount > 20"
                  style="margin-top: 16px;"></Page>
        </Card>
    </div>
</template>
<style lang="less">
    .article-list {
        padding-top: 8px;
        padding-bottom: 16px;
        width: 1000px;
        margin: 0 auto;
        cursor: pointer;
        .cate-title {
            font-size: 18px;
        }
        .list-item-block {
            display: flex;
            padding: 16px 0;
            border-bottom: 1px solid #ddd;
            .left {
                flex: 0 0 300px;
                width: 300px;
                .fs-auto-img {
                    position: relative;
                    width: 100%;
                    padding-top: 56%;
                    img {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 4px;
                    }
                }
            }
            .right {
                flex: 1;
                margin-left: 18px;
                &:hover .article-title {
                    color: #0077e6;
                }
                &:hover .article-desc {
                    color: #999;
                }
                .article-title {
                    padding: 8px 0;
                    font-size: 16px;
                    font-weight: 700;
                    transition: all 0.3s ease-in;
                }
                .article-info {
                    display: flex;
                    padding: 8px;
                    align-items: center;
                    background-color: #eee;
                    border-radius: 6px;
                    .author {
                        display: flex;
                        align-items: center;
                    }
                    & > * {
                        margin-right: 32px;
                    }
                }
                .article-desc {
                    margin-top: 8px;
                    height: 63px;
                    overflow: hidden;
                    transition: all 0.3s ease-in;
                }
            }
        }
    }
</style>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import utils from '@/libs/util';
    export default {
        name: 'articleList',
        mixins: [pageMixin],
        data () {
            return {
                cateName: ''
            };
        },
        filters: {
            deleteTag(val) {
                return utils.delHtmlTag(val);
            }
        },
        watch: {
            '$route'(to) {
                if (to.name === 'articleList') {
                    let query = this.$route.query;
                    this.cateName = query.cateName;
                    this.getArticleList(query);
                }
            }
        },
        created() {
            this.$store.commit('setToHeight', '1000px');
            let query = this.$route.query;
            this.cateName = query.cateName;
            this.getArticleList(query);
        },
        methods: {
            toArticlePage(id) {
                let params = {};
                params.name = 'articleDetail';
                params.params = { id: id };
                this.$router.push(params);
            },
            getArticleList(query) {
                let params = {};
                params.shareItem = query.keyword;
                params.knowledgeId = query.cateId;
                this.getList('/share/getShareList', params);
            }
        },
        components: {}
    };
</script>
