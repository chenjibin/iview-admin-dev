<template>
    <div class="fs-comment-list">
        <div class="fs-comment-list-top">
            <div>
                <Avatar :src="avatar" icon="person" size="large" />
                <span class="name">{{name}}</span>
            </div>
            <div>{{commentTime}}</div>
        </div>
        <div class="fs-comment-list-content">
            {{commentContent}}
        </div>
        <div class="fs-comment-list-tool" v-show="!isInComment">
            <div class="comment-btn always">
                <Icon type="thumbsup"></Icon>
                <span>赞</span>
            </div>
            <div class="comment-btn" @click="isInComment = true">
                <Icon type="ios-undo"></Icon>
                <span>回复</span>
            </div>
        </div>
        <div class="fs-comment-list-comment" v-show="isInComment">
            <div class="btn-group">
                <Button type="text" @click="isInComment = false">取消</Button>
                <Button type="primary">评论</Button>
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
    export default {
        name: 'FsCommentList',
        props: {
            avatar: String,
            name: String,
            commentContent: String,
            commentTime: String
        },
        data () {
            return {
                isInComment: false
            };
        },
        methods: {
            replyHandler() {

            }
        }
    };
</script>
