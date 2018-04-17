<template>
    <div class="article-home">
        <Row :gutter="10">
            <Col :span="12" style="margin-bottom: 8px">
            <Card :padding="0">
                <Carousel v-model="value1" autoplay :autoplay-speed="3000" trigger="hover">
                    <CarouselItem>
                        <div class="demo-carousel" @click.stop="toDetailPage">
                            <img src="http://img2.xyyzi.com/Upload/images/20180320/5ab066516d795.jpg" />
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="demo-carousel">
                            <img src="http://img2.xyyzi.com/Upload/images/20180320/5ab066516d795.jpg" />
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="demo-carousel">
                            <img src="http://img2.xyyzi.com/Upload/images/20180320/5ab066516d795.jpg" />
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="demo-carousel">
                            <img src="http://img2.xyyzi.com/Upload/images/20180320/5ab066516d795.jpg" />
                        </div>
                    </CarouselItem>
                </Carousel>
            </Card>
            </Col>
            <Col :span="12" style="margin-bottom: 8px"
                 v-for="item,index in mainBlockData"
                 :key="'main-block' + index">
                <Card :padding="0">
                    <div class="article-important-block">
                        <div class="top">
                            <h2>{{item.name}}</h2>
                            <Button type="text">查看更多<Icon type="ios-arrow-right" style="margin-left: 8px"></Icon></Button>
                        </div>
                        <div class="content-list-wrapper">
                            <Row :gutter="16">
                                <Col :span="12" v-for="article, aindex in item.share">
                                    <a href="javascript:void(0)"
                                       class="item"
                                       @click.stop="toDetailPage(article.shareId)"
                                       :title="article.share_item">{{article.share_item}}</a>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col :span="24">
            <Row :gutter="10">
                <Col :span="6">
                    <Card :padding="0">
                        <div class="fs-holder-img">
                            <img src="http://img2.xyyzi.com/Upload/images/20180320/5ab066516d795.jpg" />
                        </div>
                    </Card>
                </Col>
                <Col :span="6">
                <Card :padding="0">
                    <div class="fs-holder-img">
                        <img src="http://img2.xyyzi.com/Upload/images/20180320/5ab066516d795.jpg" />
                    </div>
                </Card>
                </Col>
                <Col :span="6">
                <Card :padding="0">
                    <div class="fs-holder-img">
                        <img src="http://img2.xyyzi.com/Upload/images/20180320/5ab066516d795.jpg" />
                    </div>
                </Card>
                </Col>
                <Col :span="6">
                <Card :padding="0">
                    <div class="fs-holder-img">
                        <img src="http://img2.xyyzi.com/Upload/images/20180320/5ab066516d795.jpg" />
                    </div>
                </Card>
                </Col>
            </Row>
            </Col>
        </Row>
    </div>
</template>
<style lang="less">
    .article-home {
        padding-top: 8px;
        .demo-carousel {
            height: 280px;
            text-align: center;
            color: #fff;
            font-size: 20px;
            background: #506b9e;
            cursor: pointer;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .article-important-block {
            height: 280px;
            padding: 16px;
            overflow: hidden;
            .top {
                display: flex;
                justify-content: space-between;
            }
            .content-list-wrapper {
                margin-top: 16px;
                .item {
                    font-size: 14px;
                    margin-bottom: 14px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: block;
                    color: #333;
                    transition: color 0.5s ease;
                    &:hover {
                        color: #0077e6;
                    }
                }
            }
        }
        .fs-holder-img {
            position: relative;
            width: 100%;
            padding-top: 56%;
            img {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 2;
                width: 100%;
                height: 100%;
                border-radius: 4px;
                cursor: pointer;
            }
        }
    }
</style>
<script>
    import FsCommentList from '@/baseComponents/fs-comment-list';
    export default {
        name: 'articleHome',
        data () {
            return {
                value1: 0,
                itemName: '范围广问过问过而望各位个问过嗡嗡而格外个额外给望各位',
                mainBlockData: []
            };
        },
        created() {
            this._getMainBolckData();
        },
        methods: {
            toDetailPage(id) {
                let params = {};
                params.name = 'articleDetail';
                params.params = { id: id };
                this.$router.push(params);
            },
            _getCarouseData() {

            },
            _getMainBolckData() {
                this.$http.get('/share/getImportantShare').then((res) => {
                    if (res.success) {
                        this.mainBlockData = res.data;
                    }
                });
            }
        },
        components: {FsCommentList}
    };
</script>
