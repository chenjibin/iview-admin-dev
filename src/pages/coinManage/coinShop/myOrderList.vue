<template>
    <div>
        <Menu mode="horizontal" active-name="1">
            <MenuItem name="1">
                <Icon type="ios-paper"></Icon>
                全部订单
            </MenuItem>
            <MenuItem name="2">
                <Icon type="ios-people"></Icon>
                待领取
            </MenuItem>
            <MenuItem name="3">
                <Icon type="settings"></Icon>
                已领取
            </MenuItem>
            <MenuItem name="4">
                <Icon type="settings"></Icon>
                已取消
            </MenuItem>
        </Menu>
        <Scroll :on-reach-bottom="handleReachTop" :distance-to-edge="0" :height="scrollHeight">
            <Card v-for="(item, index) in orderList" :key="index" style="margin: 16px 0">
                <div class="list-item">
                    <div class="list-item-top">
                        <div class="list-item-top-img-wrapper">
                            <div class="fs-square-img">
                                <img :src="'/oa/upload/' + item.image_path" />
                            </div>
                        </div>
                        <div class="list-item-top-content">
                            <p>{{item.goods_name}}</p>
                            <div class="">
                                <span>单价:</span><span>{{item.price}}金币</span>
                            </div>
                            <div class="">
                                <span>数量:</span><span>{{item.quality}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="list-item-divide"></div>
                    <div class="list-item-bottom">
                        <div class="">
                            <span>兑换日期:</span>
                            <span>{{item.created}}</span>
                            <span style="margin-left: 16px;">订单状态:</span>
                            <Tag color="green">{{item.status}}</Tag>
                        </div>
                    </div>
                </div>
            </Card>
        </Scroll>

    </div>
</template>
<style lang="less" scoped>
    .list-item {
        &-divide {
            margin: 8px 0;
            height: 1px;
            background-color: #ddd;
        }
        &-top {
            display: flex;
            &-img-wrapper {
                flex: 0 0 80px;

            }
            &-content {
                padding: 8px;
            }
        }
        &-bottom {

        }
    }
</style>
<script>
    export default {
        name: 'myOrderList',
        data () {
            return {
                orderList: [],
                scrollHeight: 300,
                pageData: {
                    page: 1,
                    pageSize: 20
                }
            };
        },
        created() {
            this._getMyOrderList();
            this._setHeight();
        },
        methods: {
            handleReachTop() {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            },
            _getMyOrderList() {
                let data = {};
                data.page = this.pageData.page;
                data.pageSize = this.pageData.pageSize;
                this.$http.get('/order/myOrderlist', {params: data}).then((res) => {
                    if (res.success) {
                        this.orderList = res.data;
                        console.log(this.orderList);
                    }
                });
            },
            _setHeight() {
                let dm = document.body.clientHeight;
                this.scrollHeight = dm - 240;
                console.log(this.scrollHeight);
            }
        },
        components: {}
    };
</script>
