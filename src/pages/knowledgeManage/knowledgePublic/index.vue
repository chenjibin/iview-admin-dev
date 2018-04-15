<template>
    <div>
        <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
        <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
    </div>
</template>
<style>

</style>
<script>
    import FsCommentList from '@/baseComponents/fs-comment-list';
    export default {
        name: 'knowledgePublic',
        data () {
            return {
                img: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
                name: '大田集',
                commentContent: '😂 去年重构一个老项目，想用babel来搞，被babel文档虐得死去活来，最后还是看不懂',
                commentTime: '7天前'
            };
        },
        components: {
            FsCommentList
        }
    };
</script>
