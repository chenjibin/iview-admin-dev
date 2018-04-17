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
                <div class="zan-btn">
                    <div class="icon-wrapper">
                        <Icon type="thumbsup"></Icon>
                    </div>
                    <div class="text">{{thumbUpTimes}}</div>
                </div>
            </div>
            <h2 class="title">{{articleTitle}}</h2>
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
                                     :key="'comment-' + index"
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
            .title {
                margin-bottom: 20px;
                font-size: 24px;
            }
            .main-content {
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
                thumbUpTimes: 0,
                editorContent: '',
                editorMeun: [
                    'emoticon'
                ],
                defaultText: '写下你的评论...',
                img: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
                name: '大田集',
                commentContent: '😂 去年重构一个老项目，想用babel来搞，被babel文档虐得死去活来，最后还是看不懂',
                commentTime: '7天前',
                html: ''
            };
        },
        activated() {
            let data = {};
            data.shareId = this.$route.params.id;
            this.$http.get('/share/getShareDetail', {params: data}).then((res) => {
                if (res.success) {
                    this.articleTitle = res.data.share_item;
                    this.html = res.data.share_detail;
                    this.thumbUpTimes = res.data.thumb_up_times;
                }
            });
            this.getCommentList();
        },
        methods: {
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
