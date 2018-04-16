<template>
    <div>
        <Row :gutter="10">
            <Col :span="12" style="margin-bottom: 8px">
            <Card :padding="0">
                <Carousel v-model="value1" loop>
                    <CarouselItem>
                        <div class="demo-carousel">1</div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="demo-carousel">2</div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="demo-carousel">3</div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="demo-carousel">4</div>
                    </CarouselItem>
                </Carousel>
            </Card>
            </Col>
            <Col :span="12" style="margin-bottom: 8px">
            <Card :padding="0">
                <div class="" style="height: 320px;padding: 12px;overflow: hidden">

                </div>
            </Card>
            </Col>
            <Col :span="12" style="margin-bottom: 8px">
            <Card :padding="0">
                <div class="" style="height: 320px;padding: 12px;overflow: hidden">
                    <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
                    <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
                </div>
            </Card>
            </Col>
            <Col :span="12" style="margin-bottom: 8px">
            <Card :padding="0">
                <div class="" style="height: 320px;padding: 12px;overflow: hidden">
                    <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
                    <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
                </div>
            </Card>
            </Col>
            <Col :span="24">
            <Row :gutter="10">
                <Col :span="6"><Card>
                <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>

            </Card></Col>
                <Col :span="6"><Card>
                <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>

            </Card></Col>
                <Col :span="6"><Card>
                <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
            </Card></Col>
                <Col :span="6"><Card>
                <fs-comment-list v-bind={avatar:img,name:name,commentContent:commentContent,commentTime:commentTime}></fs-comment-list>
            </Card></Col>
            </Row>
            </Col>
        </Row>
    </div>
</template>
<style>
.demo-carousel {
    height: 320px;
    line-height: 360px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    background: #506b9e;
}
</style>
<script>
    import FsCommentList from '@/baseComponents/fs-comment-list';
    export default {
        name: 'articleHome',
        data () {
            return {
                value1: 0,
                img: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
                name: '大田集',
                commentContent: '😂 去年重构一个老项目，想用babel来搞，被babel文档虐得死去活来，最后还是看不懂',
                commentTime: '7天前'
            };
        },
        components: {FsCommentList}
    };
</script>
