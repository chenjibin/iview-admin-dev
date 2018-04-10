<template>
    <div id="coin-shop">
        <Row :gutter="16">
            <Col :xs="24" :sm="24" :md="14" :lg="16">
                <Card :dis-hover="true">
                    <h3 class="margin-bottom-10">商品列表</h3>
                    <div :style="{height: listHeight}" style="overflow: auto;padding: 16px;">
                        <Row :gutter="8">
                            <Col :xs="12"
                                 :sm="12"
                                 :md="6"
                                 :lg="6"
                                 v-for="(item, index) in goodList"
                                 :key="'good-item-' + index"
                                 style="margin-bottom: 8px;">
                            <Card class="good-item-wrapper">
                                <div class="fs-square-img" style="margin-bottom: 8px;">
                                    <img v-lazy="'/oa/upload/' + item.image_path">
                                </div>
                                <Tooltip placement="top-start" :transfer="true">
                                    <div slot="content">
                                        <p style="white-space: normal">{{item.name}}</p>
                                    </div>
                                    <p class="title">{{item.name}}</p>
                                </Tooltip>
                                <Row style="text-align: center;">
                                    <Col>
                                    <span class="coin">{{item.price}}</span>
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
                    </div>
                </Card>
            </Col>
            <Col :xs="24" :sm="24" :md="10" :lg="8">
                <Card :dis-hover="true">
                    <h3>我的订单</h3>
                    <order-list ref="orderList"></order-list>
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
                                    <img v-lazy="goodDesc.pic"/>
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
                        <count-to :endVal="totalCost" :count-style="contStyle">
                            <span slot="rightText" style="font-weight: 700;">金币</span>
                        </count-to>
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
    @import "../../../styles/common";
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
    import orderList from './myOrderList';
    export default {
        name: 'coinShop',
        data () {
            return {
                subLoading: false,
                buyFlag: false,
                listHeight: '300px',
                goodList: [],
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
            this._setListHeight();
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
                this.buyForm.id = data.id;
                this.goodDesc.name = data.name;
                this.goodDesc.pic = '/oa/upload/' + data.image_path;
                this.goodDesc.coin = data.price;
                this.buyFlag = true;
            },
            _submitBuy() {
                this.subLoading = true;
                let data = {};
                data.id = this.buyForm.id;
                data.quality = this.buyForm.quality;
                this.$http.post('/order/add', data).then((res) => {
                    if (res.success) {
                        this.$store.commit('updateUserInfo');
                        this.$Message.success('商品兑换成功!');
                        this.$refs.orderList.upDateOrderList();
                        this.buyFlag = false;
                    }
                }).finally(() => {
                    this.subLoading = false;
                });
            },
            _getGoodList() {
                this.$http.get('/order/goldMall').then((res) => {
                    if (res.success) {
                        this.goodList = res.data;
                    }
                });
            },
            _setListHeight() {
                let dm = document.body.clientHeight;
                this.listHeight = dm - 190 + 'px';
            }
        },
        components: {
            countTo,
            orderList
        }
    };
</script>
