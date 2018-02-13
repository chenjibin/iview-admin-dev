<template>
    <div id="coin-shop">
        <Row :gutter="16">
            <Col :xs="12"
                 :sm="6"
                 :md="6"
                 :lg="4"
                 v-for="(item, index) in goodList"
                 :key="'good-item-' + index"
                 style="margin-bottom: 16px;">
                <Card class="good-item-wrapper">
                    <div class="fs-square-img">
                        <img :src="item.pic">
                    </div>
                    <p class="title">{{item.name}}</p>
                    <Row type="flex" justify="space-between" align="middle" style="margin-top: 16px;">
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
                        <FormItem label="商品名称">
                            <span>{{goodDesc.name}}</span>
                        </FormItem>
                        <FormItem label="商品预览">
                            <div style="width: 160px">
                                <div class="fs-square-img">
                                    <img :src="goodDesc.pic"/>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem label="商品单价">
                            <span>{{goodDesc.coin}}</span>
                        </FormItem>
                        <FormItem label="购买数量">
                            <InputNumber :min="1" v-model="buyForm.quality"></InputNumber>
                        </FormItem>
                    </Form>
                </Col>
                <Col :span="12">
                    <div class="result-block" style="">
                        <p class="title">总消费</p>
                        <p class="result">{{totalCost}}</p>
                    </div>
                </Col>
            </Row>

            <div slot="footer">
                <Button type="primary"  @click="_submitBuy">立即兑换</Button>
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
            .result {
                font-size: 60px;
            }
        }
    }
    #coin-shop {
        .good-item-wrapper {
            .coin {
                font-size: 18px;
                font-weight: 700;
                color: red;
            }
        }

    }
</style>
<script>
    export default {
        name: 'coinShop',
        data () {
            return {
                buyFlag: false,
                goodList: [
                    {
                        name: 'NGQ01 天马体育专卖店50元现金券',
                        coin: 100,
                        pic: 'http://tm.xyyzi.com:9090/oa/upload/1_1507890861765.png'
                    },
                    {
                        name: 'DZ 工作牌带子',
                        coin: 100,
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
                    type: '',
                    pic: '',
                    coin: 0
                },
                buyForm: {
                    id: '',
                    price: '',
                    quality: 1
                }
            };
        },
        computed: {
            totalCost() {
                return this.buyForm.quality * this.goodDesc.coin;
            }
        },
        methods: {
            _openBuy(data) {
                this.buyFlag = true;
                this.goodDesc.name = data.name;
                this.goodDesc.pic = data.pic;
                this.goodDesc.coin = data.coin;
                console.log(data);
            },
            _submitBuy() {
            }
        },
        components: {}
    };
</script>
