<template>
    <div class="article-list">
        <Card>
            <h2 class="cate-title">商品知识</h2>
            <div class="list-item-block">
                <div class="left">
                    <div class="">
                        <img src="" />
                    </div>
                </div>
                <div class="right">
                    <div class="article-title"></div>
                    <div class="article-info">
                        <div>
                            <Avatar icon="person" />
                            <span>XXX</span>
                        </div>
                        <div class="">ssssss</div>
                        <div class="">点赞12</div>
                        <div class="">评论21</div>
                    </div>
                    <div class="article-desc"></div>
                </div>
            </div>
        </Card>
    </div>
</template>
<style lang="less">
    .article-list {
        padding-top: 8px;
        width: 800px;
        margin: 0 auto;
        .cate-title {
            font-size: 18px;
        }
    }
</style>
<script>
    export default {
        name: 'articleList',
        data () {
            return {};
        },
        watch: {
            '$route'(to) {
                console.log(to);
            }

        },
        components: {}
    };
</script>
