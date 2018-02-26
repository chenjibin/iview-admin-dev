<template>
    <div>
        <Menu mode="horizontal" active-name="3" @on-select="_orderStatusChange">
            <MenuItem name="3">
                <Icon type="ios-paper"></Icon>
                全部订单
            </MenuItem>
            <MenuItem name="0">
                <Icon type="ios-people"></Icon>
                待领取
            </MenuItem>
            <MenuItem name="1">
                <Icon type="settings"></Icon>
                已领取
            </MenuItem>
            <MenuItem name="2">
                <Icon type="settings"></Icon>
                已取消
            </MenuItem>
        </Menu>
        <Scroll :on-reach-bottom="handleReachTop"
                :distance-to-edge="0"
                :loading-text="loadingText"
                :height="scrollHeight">
            <Card v-for="(item, index) in orderList"
                  :key="index" style="margin: 16px 0;width: 98%;">
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
                                <span>订单总价:</span><span>{{item.price}}金币</span>
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
                            <Tag :color="item.status | _returnColor">{{item.status | _returnStatus}}</Tag>
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
                loadingText: '加载中',
                pageData: {
                    page: 1,
                    pageSize: 20,
                    totalCount: 0,
                    status: '3'
                }
            };
        },
        filters: {
            _returnColor(val) {
                let color = 'default';
                if (val === 0) color = 'red';
                else color = 'green';
                return color;
            },
            _returnStatus(val) {
                let status = '已取消';
                if (val === 0) status = '待领取';
                else status = '已领取';
                return status;
            }
        },
        created() {
            this._getMyOrderList();
            this._setHeight();
        },
        methods: {
            _orderStatusChange(name) {
                this.pageData.status = name;
                this._getMyOrderList();
                console.log(name);
            },
            handleReachTop() {
                return new Promise((resolve, reject) => {
                    let data = {};
                    data.page = this.pageData.page++;
                    data.pageSize = this.pageData.pageSize;
                    data.status = this.pageData.status;
                    let totalPage = Math.ceil(this.pageData.totalCount / this.pageData.pageSize);
                    if (data.page > totalPage) {
                        this.loadingText = '已经加载完全部订单!';
                        reject(new Error('已经加载完全部订单!'));
                    }
                    this.$http.get('/order/myOrderlist', {params: data}).then((res) => {
                        if (res.success) {
                            this.orderList = [...this.orderList, ...res.data];
                            this.pageData.totalCount = res.totalCount;
                            resolve();
                        }
                    });
                });
            },
            _getMyOrderList() {
                let data = {};
                data.page = this.pageData.page;
                data.pageSize = this.pageData.pageSize;
                data.status = this.pageData.status;
                this.$http.get('/order/myOrderlist', {params: data}).then((res) => {
                    if (res.success) {
                        this.orderList = res.data;
                        this.pageData.totalCount = res.totalCount;
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
