<template>
    <div class="fs-comment-list">
        <div class="fs-comment-list-top">
            <div>
                <Avatar :src="commentData.headimagepath" icon="person" size="large" />
                <span class="name">{{commentData.username || '...'}}</span>
                <span v-if="commentData.to_username"> 回复 {{commentData.to_username}}</span>
            </div>
            <div>{{commentData.insert_time || '...'}}</div>
        </div>
        <div class="fs-comment-list-content" v-html="commentData.content || '...'"></div>
        <div class="fs-comment-list-tool" v-show="!isInComment">
            <div class="comment-btn always " @click.stop="_thumbsupHandler" :class="{'is-active': isZan}">
                <Icon type="thumbsup"></Icon>
                <span>{{+thumbUpTimes ? thumbUpTimes : '赞'}}</span>
            </div>
            <div class="comment-btn" @click.stop="openReplay">
                <Icon type="ios-undo"></Icon>
                <span>回复</span>
            </div>
            <div class="comment-btn" @click.stop="_delComment" v-if="+commentData.status === 1">
                <Icon type="ios-trash"></Icon>
                <span>删除</span>
            </div>
        </div>
        <div class="fs-comment-list-comment" v-if="isInComment">
            <div>
                <wang-editor
                        :menus="editorMeun"
                        :min-height="64"
                        :defaul-text="defaultText"
                        ref="wangEditor"
                        :editorcontent.sync="editorContent"></wang-editor>

            </div>
            <div class="btn-group">
                <Button type="text" @click="isInComment = false">取消</Button>
                <Button type="primary" @click="replyHandler">评论</Button>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    .fs-comment-list {
        padding: 12px 20px;
        border-bottom: 1px solid #ddd;
        background-color: #fff;
        font-size: 16px;
        &:hover .comment-btn{
            opacity: 0.8;
        }
        &-top {
            display: flex;
            justify-content: space-between;
        }
        &-content {
            margin: 12px 0;
        }
        &-tool {
            display: flex;
            .comment-btn {
                margin-right: 16px;
                cursor: pointer;
                opacity: 0;
                transition: all 0.3s;
                &.is-active {
                    color: #0084ff;
                }
                &.always {
                    opacity: 0.8;
                }
                &:hover {
                    opacity: 1;
                }
            }
        }
        &-comment {
            .btn-group {
                text-align: right;
            }
        }
    }
</style>
<script>
    import WangEditor from '@/baseComponents/fs-wangeditor';
    export default {
        name: 'FsCommentList',
        props: {
            commentData: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data () {
            const defaultContent = `回复${this.commentData.username}`;
            return {
                defaultText: defaultContent,
                editorContent: '',
                editorMeun: [
                    'emoticon'
                ],
                isInComment: false,
                thumbUpTimes: this.commentData.thumb_up_times,
                isZan: !!this.commentData.thumbupid,
                thumbUpId: this.commentData.thumbupid || null
            };
        },
        methods: {
            _thumbsupHandler() {
                if (!this.isZan) {
                    let data = {};
                    data.shareId = this.commentData.share_id;
                    data.shareCommentId = this.commentData.id;
                    data.type = 1;
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
            _delComment() {
                this.$Modal.confirm({
                    content: '确认删除此条评价么？',
                    okText: '确认删除',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = this.commentData.id;
                        this.$http.post('/share/deleteShareComment', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('评论删除成功!');
                                this.$emit('comment-success');
                            }
                        });
                    }
                });
            },
            openReplay() {
                this.editorContent = '';
                this.isInComment = true;
            },
            replyHandler() {
                let data = {};
                data.shareId = this.commentData.share_id;
                data.content = this.editorContent;
                data.toUserId = this.commentData.userid;
                data.toUserName = this.commentData.username;
                this.$http.post('/share/addShareComment', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('评论成功 ！');
                        this.$refs.wangEditor.clearContent();
                        this.$emit('comment-success');
                        this.isInComment = false;
                    }
                });
            }
        },
        components: {
            WangEditor
        }
    };
</script>
