<template>
    <Card class="coin-change">
        <Row type="flex" justify="space-between" class="coin-change-header">
            <Col>
                <p class="coin-change-title">我的金币动态</p>
            </Col>
            <Col>
                <Button type="primary"
                        shape="circle"
                        icon="ios-flag-outline"
                        style="margin-right: 8px;"
                        @click.stop="modelCoinFlag = true">金币排行</Button>
                <Button type="primary"
                        shape="circle"
                        icon="ios-search"
                        @click.stop="modelFlag = true">我的金币动态</Button>
            </Col>
        </Row>
        <div class="coin-change-list">
            <Row class="coin-change-list-item" type="flex" align="middle" v-for="(item, index) in itemData" :key="'coin-change-' + index">
                <Col :span="4">
                    <div class="coin-change-list-item-num">
                        <span class="tag" :class="[Number(item.opt_num) > 0 ? 'up': 'down']">{{item.opt_num}}</span>
                    </div>
                </Col>
                <Col :span="12">
                    <div class="coin-change-list-item-desc">{{item.reason}}</div>
                </Col>
                <Col :span="8">
                    <div class="coin-change-list-item-time">{{item.opt_time}}</div>
                </Col>
            </Row>
        </div>
        <Modal v-model="modelCoinFlag" width="800" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>金币排行榜</span>
            </p>
            <Row :gutter="5" style="margin-bottom: 10px;">
                <Col :md="12" :lg="12">
                <coin-ranking
                        :loading="coinLoadingFlag"
                        tag-color="#19be6b"
                        coin-title="金币排行红榜"
                        :row-data="rankDataRed">
                </coin-ranking>
                </Col>
                <Col :md="12" :lg="12">
                <coin-ranking
                        :loading="coinLoadingFlag"
                        tag-color="#ed3f14"
                        coin-title="金币排行黑榜"
                        :row-data="rankDataBlack">
                </coin-ranking>
                </Col>
            </Row>
            <div slot="footer">
            </div>
        </Modal>
        <Modal v-model="modelFlag" width="800" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>我的金币动态</span>
            </p>
            <Table height="400"
                   :columns="columns"
                   :data="rowData"
                   :loading="loading"
                   class="sys-notice-table"></Table>
            <Page :total="pageData.totalData"
                  size="small"
                  @on-change="pageChangeHandler"
                  @on-page-size-change="pageSizeChangeHandler"
                  show-elevator
                  show-sizer></Page>
            <div slot="footer">
            </div>
        </Modal>
    </Card>
</template>
<style lang="less">
    .coin-change {
        user-select: none;
        &-header {
            margin-bottom: 10px;
        }
        &-title {
            font-size: 18px;
            font-weight: 700;
        }
        &-list {
            &-item {
                padding: 8px 0;
                &-num {
                    text-align: center;
                    .tag {
                        padding: 4px 8px;
                        display: inline-block;
                        border-radius: 6px;
                        color: #fff;
                        &.up {
                            background-color: #19be6b;
                        }
                        &.down {
                            background-color: #ed3f14;
                        }
                    }
                }
            }
        }
    }
</style>
<script>
    import coinRanking from './coinRanking';
    export default {
        data () {
            return {
                loading: false,
                modelCoinFlag: false,
                coinLoadingFlag: false,
                rankDataRed: [],
                rankDataBlack: [],
                pageData: {
                    totalData: 0,
                    pageSize: 10,
                    current: 1
                },
                modelFlag: false,
                itemData: [],
                columns: [
                    {
                        title: '金币变更',
                        width: 100,
                        key: 'opt_num',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: Number(params.row.opt_num) > 0 ? '#19be6b' : '#ed3f14'
                                }
                            }, params.row.opt_num);
                        }
                    },
                    {
                        title: '属性',
                        key: 'property',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '说明',
                        key: 'reason'
                    },
                    {
                        title: '日期',
                        key: 'opt_time',
                        width: 180,
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        key: 'opter',
                        width: 80
                    }
                ],
                rowData: []
            };
        },
        created() {
            this._getLatestData();
            this._getRankData();
            this._getData(this.pageData.current, this.pageData.pageSize);
        },
        methods: {
            _getRankData() {
                this.coinLoadingFlag = true;
                this.$http
                    .all([this.$http.get('/main/Ranking?page=1&pageSize=10000&type=1'), this.$http.get('/main/Ranking?page=1&pageSize=10000&type=2')])
                    .then(this.$http.spread((res1, res2) => {
                        if (res1.success) {
                            this.rankDataBlack = res1.data;
                        }
                        if (res2.success) {
                            this.rankDataRed = res2.data;
                        }
                    })).finally(() => {
                        this.coinLoadingFlag = false;
                    });
            },
            pageChangeHandler(current) {
                this._getData(current, this.pageData.pageSize);
                this.pageData.current = current;
            },
            pageSizeChangeHandler(size) {
                this._getData(1, size);
                this.pageData.pageSize = size;
            },
            _getData(page, pageSize) {
                this.loading = true;
                let data = {
                    page: page,
                    pageSize: pageSize
                };
                this.$http.get('/main/getMyCoinLogList', {params: data}).then((res) => {
                    if (res.success) {
                        this.pageData.totalData = res.totalCount;
                        this.rowData = res.data;
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            _getLatestData() {
                let data = {
                    page: 1,
                    pageSize: 5
                };
                this.$http.get('/main/getMyCoinLogList', {params: data}).then((res) => {
                    if (res.success) {
                        this.itemData = res.data;
                    }
                });
            }
        },
        components: {
            coinRanking
        }
    };
</script>
