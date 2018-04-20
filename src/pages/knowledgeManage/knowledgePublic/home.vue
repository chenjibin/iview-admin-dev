<template>
    <div class="article-home">
        <Row :gutter="10">
            <Col :span="12" style="margin-bottom: 8px">
                <Card :padding="0">
                    <Carousel v-model="value1"
                              trigger="hover"
                              autoplay
                              ref="carousel"
                              :autoplay-speed="5000">
                        <CarouselItem v-for="item, index in mainBannerData" :key="'banner-' + index">
                            <div class="demo-carousel" @click.stop="toDetailPage(item.id)">
                                <div class="demo-carousel-inner">
                                    <img :src="item.file_path" />
                                </div>
                            </div>
                        </CarouselItem>
                    </Carousel>
                </Card>
            </Col>
            <Col :span="12" style="margin-bottom: 8px">
            <Card :padding="0">
                <div class="article-important-block">
                    <div class="article-important-block-inner">
                        <div class="top">
                            <h2>最新知识</h2>
                        </div>
                        <div class="content-list-wrapper">
                            <Row :gutter="16">
                                <Col :span="12" v-for="article, aindex in newArticle" :key="'article-' + aindex">
                                <a href="javascript:void(0)"
                                   class="item"
                                   @click.stop="toDetailPage(article.id)"
                                   :title="article.share_item">{{article.share_item}}</a>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </Card>
            </Col>
            <Col :span="12" style="margin-bottom: 8px"
                 v-for="item,index in mainBlockData"
                 :key="'main-block' + index">
                <Card :padding="0">
                    <div class="article-important-block">
                        <div class="article-important-block-inner">
                            <div class="top">
                                <h2>{{item.name}}</h2>
                                <Button type="text" @click="checkMore(item)">查看更多<Icon type="ios-arrow-right" style="margin-left: 8px"></Icon></Button>
                            </div>
                            <div class="content-list-wrapper">
                                <Row :gutter="16">
                                    <Col :span="12" v-for="article, aindex in item.share" :key="'article-' + aindex">
                                    <a href="javascript:void(0)"
                                       class="item"
                                       @click.stop="toDetailPage(article.shareId)"
                                       :title="article.share_item">{{article.share_item}}</a>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col :span="24">
                <Row :gutter="10">
                    <Col :span="6" v-for="item,index in mainShowPicData" :key="'show-' + index" style="margin-bottom: 8px;">
                        <Card :padding="0">
                            <div class="fs-holder-img" @click.stop="toDetailPage(item.id)">
                                <img :src="item.file_path" />
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
            position: relative;
            width: 100%;
            padding-top: 56%;
            cursor: pointer;
            overflow: hidden;
            &-inner {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 2;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }

        }
        .article-important-block {
            position: relative;
            padding-top: 56%;
            width: 100%;
            overflow: hidden;
            &-inner {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;
                width: 100%;
                height: 100%;
                padding: 16px;
                .top {
                    display: flex;
                    justify-content: space-between;
                }
                .content-list-wrapper {
                    margin-top: 32px;
                    .item {
                        font-size: 14px;
                        margin-bottom: 16px;
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
                mainBlockData: [],
                mainBannerData: [],
                mainShowPicData: [],
                newArticle: []
            };
        },
        created() {
            this._getMainBolckData();
            this._getCarouseData();
            this._getShowPicData();
            this._getNewBlockData();
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.carousel.handleResize();
            });
        },
        methods: {
            checkMore(data) {
                this.$store.commit('setCateId', data.khmId);
                this.$store.commit('setCateName', data.name);
                this.$store.commit('toListPage', this);
            },
            toDetailPage(id) {
                let params = {};
                params.name = 'articleDetail';
                params.params = { id: id };
                this.$router.push(params);
            },
            _getShowPicData() {
                this.$http.get('/share/getShowPic').then((res) => {
                    if (res.success) {
                        this.mainShowPicData = res.data;
                    }
                });
            },
            _getCarouseData() {
                this.$http.get('/share/getShowBanner').then((res) => {
                    if (res.success) {
                        this.mainBannerData = res.data;
                    }
                });
            },
            _getNewBlockData() {
                this.$http.get('share/getNewShareList').then((res) => {
                    if (res.success) {
                        this.newArticle = res.data;
                    }
                });
            },
            _getMainBolckData() {
                this.$http.get('/share/getImportantShareNew').then((res) => {
                    if (res.success) {
                        this.mainBlockData = res.data;
                    }
                });
            }
        },
        components: {FsCommentList}
    };
</script>
