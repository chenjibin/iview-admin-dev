<template>
    <div class="article-detail">
        <div class="inner">
            <div class="ver-btn">
                <div class="zan-btn" @click.stop="$router.go(-1)">
                    <div class="icon-wrapper" style="background-color: #ddd;color: #666;">
                        <Icon type="ios-undo"></Icon>
                    </div>
                    <div class="text" style="color: #666;">返回</div>
                </div>
                <div class="zan-btn" :class="{'is-zan': isZan}" @click.stop="_thumbArticle">
                    <div class="icon-wrapper">
                        <Icon type="thumbsup"></Icon>
                    </div>
                    <div class="text">{{thumbUpTimes}}</div>
                </div>
            </div>
            <h2 class="title">{{articleTitle}}</h2>
            <div class="article-info">
                <Avatar :src="articleHeadpic" />
                <span style="margin-left: 4px;">{{articleAuthor}}</span>
            </div>
            <p class="zan-info">{{thumbUpTimes}}人赞了该文章</p>
            <div class="main-content" v-html="html"></div>
            <div class="comment-block">
                <div class="top">
                    <span class="number">{{pageData.totalCount || 0}}条评论</span>
                </div>
                <div class="your-comment">
                    <wang-editor
                            :menus="editorMeun"
                            :min-height="64"
                            :defaul-text="defaultText"
                            ref="wangEditor"
                            :editorcontent.sync="editorContent"></wang-editor>
                    <div class="btn-group" style="text-align: right">
                        <Button type="primary" @click.stop="replyHandler">评论</Button>
                    </div>
                </div>
                <div class="list">
                    <fs-comment-list :comment-data="item"
                                     :key="'comment-' + item.id"
                                     @comment-success="getCommentList"
                                     v-for="item, index in pageData.list"></fs-comment-list>
                </div>
                <Page :total="pageData.totalCount"
                      :current.sync="pageData.page"
                      :page-size="pageData.pageSize"
                      @on-change="getCommentList"
                      show-total
                      v-if="pageData.totalCount > 20"
                      style="margin-top: 16px;"></Page>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    .article-detail {
        padding-top: 20px;
        padding-bottom: 100px;
        background-color: #fff;
        .inner {
            width: 690px;
            margin: 0 auto;
            .ver-btn {
                position: fixed;
                left: 0;
                right: 0;
                width: 884px;
                height: 0;
                pointer-events: none;
                margin: auto;
                top: 106px;
                .zan-btn {
                    display: block;
                    width: 48px;
                    color: #8590a6;
                    line-height: 1.14286;
                    font-size: 14px;
                    margin-bottom: 20px;
                    pointer-events: auto;
                    transition: color .3s;
                    text-align: center;
                    cursor: pointer;
                    &:hover .icon-wrapper {
                        background: rgba(0,132,255,.15);
                        transform: scale(1.1);
                    }
                    &:hover .text {
                        transform: translateY(4px);
                    }
                    &.is-zan .icon-wrapper {
                        color: #f6f6f6;
                        background-color: #0084ff
                    }
                    .icon-wrapper {
                        border-radius: 50%;
                        width: 48px;
                        height: 48px;
                        line-height: 48px;
                        background-color: rgba(0,132,255,.1);
                        color: #0084ff;
                        font-size: 26px;
                        will-change: transform;
                        transition: -webkit-transform .3s;
                        transition: transform .3s;
                        transition: transform .3s,-webkit-transform .3s;
                    }
                    .text {
                        margin-top: 8px;
                        height: 16px;
                        overflow: hidden;
                        color: #0084ff;
                        transition: -webkit-transform .3s;
                        transition: transform .3s;
                        transition: transform .3s,-webkit-transform .3s;
                    }
                }
            }
            .article-info {
                display: flex;
                align-items: center;
                font-size: 16px;
                font-weight: 700;
            }
            .zan-info {
                font-size: 14px;
                margin-top: 8px;
                padding-left: 6px;
            }
            .title {
                margin-bottom: 16px;
                font-size: 24px;
            }
            .main-content {
                margin-top: 32px;
                font-size: 16px;
                p {
                    margin: 10px 0;
                    line-height: 1.5;
                }
            }
            .comment-block {
                margin-top: 16px;
                .top {
                    padding: 16px 8px 0;
                    .number {
                        font-size: 16px;
                        font-weight: 700;
                    }
                }
                .your-comment {
                    margin-top: 16px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #ddd;
                }
            }
        }
    }
</style>
<script>
    import FsCommentList from '@/baseComponents/fs-comment-list';
    import WangEditor from '@/baseComponents/fs-wangeditor';
    import pageMixin from '@/mixins/pageMixin';
    export default {
        name: 'articleDetail',
        mixins: [pageMixin],
        data () {
            return {
                articleTitle: '',
                articleAuthor: '',
                articleHeadpic: '',
                thumbUpTimes: 0,
                editorContent: '',
                editorMeun: [
                    'emoticon'
                ],
                defaultText: '写下你的评论...',
                html: '',
                isZan: false,
                thumbUpId: null
            };
        },
        created() {
            let data = {};
            data.shareId = this.$route.params.id;
            this.$http.get('/share/getShareDetail', {params: data}).then((res) => {
                if (res.success) {
                    this.articleTitle = res.data.share_item;
                    this.articleAuthor = res.data.insert_username;
                    this.articleHeadpic = res.data.headimagepath;
                    this.html = res.data.share_detail;
                    this.thumbUpTimes = res.data.thumb_up_times;
                    this.isZan = !!res.data.thumbupid;
                    this.thumbUpId = res.data.thumbupid || null;
                }
            });
            this.getCommentList();
            this.$store.commit('setToHeight', '880px');
        },
        methods: {
            _thumbArticle() {
                if (!this.isZan) {
                    let data = {};
                    data.shareId = this.$route.params.id;
                    data.type = 0;
                    this.$http.post('/share/addThumbup', data).then((res) => {
                        if (res.success) {
                            this.isZan = true;
                            this.thumbUpId = res.data.id;
                            this.thumbUpTimes = res.data.thumb_up_times;
                        }
                    });
                } else {
                    let data = {};
                    data.id = this.thumbUpId;
                    this.$http.post('/share/deleteThumbup', data).then((res) => {
                        if (res.success) {
                            this.isZan = false;
                            this.thumbUpId = null;
                            this.thumbUpTimes = res.data.thumb_up_times;
                        }
                    });
                }
            },
            replyHandler() {
                let data = {};
                data.shareId = this.$route.params.id;
                data.content = this.editorContent;
                this.$http.post('/share/addShareComment', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('评论成功 ！');
                        this.$refs.wangEditor.clearContent();
                        this.getCommentList();
                    }
                });
            },
            getCommentList() {
                let params = {};
                params.shareId = this.$route.params.id;
                this.getList('/share/getShareCommentList', params);
            }
        },
        components: {FsCommentList, WangEditor}
    };
</script>
