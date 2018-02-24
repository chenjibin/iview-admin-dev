<template>
    <div id="coin-shop">
        <Row :gutter="8">
            <Col :xs="12"
                 :sm="6"
                 :lg="4"
                 :md="6"
                 v-for="(item, index) in goodList"
                 :key="'good-item-' + index"
                 style="margin-bottom: 8px;">
                <Card class="good-item-wrapper">
                    <div class="fs-square-img" style="margin-bottom: 8px;">
                        <img :src="item.pic">
                    </div>
                    <Tooltip placement="top-start" :transfer="true">
                        <div slot="content">
                            <p style="white-space: normal">{{item.name}}</p>
                        </div>
                        <p class="title">{{item.name}}</p>
                    </Tooltip>
                    <Row type="flex" justify="space-between" align="middle" style="margin-top: 8px;">
                        <Col>
                            <span class="coin">{{item.coin}}</span>
                            <span>金币</span>
                        </Col>
                        <Col>
                        <Button type="primary"
                                shape="circle"
                                @click="_openBuy(item)"
                                icon="bag">立即兑换</Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="buyFlag"
               :mask-closable="false"
               width="600">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>兑换商品</span>
            </p>
            <Row :gutter="16" type="flex" class="coin-shop-form">
                <Col :span="12">
                    <Form :label-width="80">
                        <FormItem label="商品名称:">
                            <span>{{goodDesc.name}}</span>
                        </FormItem>
                        <FormItem label="商品预览:">
                            <div style="width: 160px">
                                <div class="fs-square-img">
                                    <img :src="goodDesc.pic"/>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem label="商品单价:">
                            <span>{{goodDesc.coin}}</span>
                        </FormItem>
                        <FormItem label="购买数量:">
                            <InputNumber :min="1" v-model="buyForm.quality"></InputNumber>
                        </FormItem>
                    </Form>
                </Col>
                <Col :span="12">
                    <div class="result-block">
                        <p class="title">总消费</p>
                        <count-to :endVal="totalCost" :count-style="contStyle"></count-to>
                    </div>
                </Col>
            </Row>

            <div slot="footer">
                <Button type="primary"
                        :loading="subLoading"
                        @click="_submitBuy">立即兑换</Button>
                <Button type="ghost" style="margin-left: 8px" @click="buyFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style lang="less">
    .coin-shop-form {
        .result-block {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;
            height: 100%;
            .title {
                font-size: 30px;
                font-weight: 700;
                margin-bottom: 16px;
            }
        }
    }
    #coin-shop {
        .good-item-wrapper {
            .title {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            .coin {
                font-size: 18px;
                font-weight: 700;
                color: red;
            }
        }
        .ivu-tooltip {
            display: block;
            width: 100%;
            .ivu-tooltip-rel {
                width: 100%;
            }
        }
    }
</style>
<script>
    import countTo from '@/baseComponents/CountTo';
    export default {
        name: 'coinShop',
        data () {
            return {
                subLoading: false,
                buyFlag: false,
                goodList: [
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'DZ 工作牌带子',
                        coin: 200,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1500002183174.jpg'
                    },
                    {
                        name: 'C3710 心相印红悦系列10包装四层纸手帕10包',
                        coin: 50,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1428485049746.png'
                    },
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'DZ 工作牌带子',
                        coin: 200,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1500002183174.jpg'
                    },
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    }
                ],
                goodDesc: {
                    name: '',
                    pic: '',
                    coin: 0
                },
                contStyle: {
                    fontSize: '60px'
                },
                buyForm: {
                    id: '',
                    quality: 1
                }
            };
        },
        computed: {
            totalCost() {
                return this.buyForm.quality * this.goodDesc.coin;
            }
        },
        created() {
            this._getGoodList();
        },
        methods: {
            _initData() {
                this.buyForm.id = '';
                this.buyForm.quality = 1;
                this.goodDesc.coin = 0;
                this.goodDesc.name = '';
                this.goodDesc.pic = '';
            },
            _openBuy(data) {
                this._initData();
                this.buyFlag = true;
                this.goodDesc.name = data.name;
                this.goodDesc.pic = data.pic;
                this.goodDesc.coin = data.coin;
                console.log(data);
            },
            _submitBuy() {
                this.subLoading = true;
                let data = {};
                data.id = this.buyForm.id;
                data.quality = this.buyForm.quality;
                data.price = this.goodDesc.coin;
                data.totalPrice = data.price * data.quality;
                this.$http.post('', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('商品兑换成功!');
                        this.buyFlag = false;
                    }
                }).finally(() => {
                    this.subLoading = false;
                });
            },
            _getGoodList() {
                this.$http.get('/order/orderlist').then((res) => {
                    console.log(res);
                    if (res.success) {
                        this.goodList = res.data;
                    }
                });
            }
        },
        components: {
            countTo
        }
    };
</script>
