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
                        @click.stop="modelFlag = true">查看更多</Button>
            </Col>
        </Row>
        <div class="coin-change-list">
            <Row class="coin-change-list-item" type="flex" align="middle" v-for="(item, index) in itemData" :key="'coin-change-' + index">
                <Col :span="4">
                    <div class="coin-change-list-item-num">
                        <span class="tag" :class="[item.type === 'up'? 'up': 'down']">{{item.num}}</span>
                    </div>
                </Col>
                <Col :span="12">
                    <div class="coin-change-list-item-desc">{{item.desc}}</div>
                </Col>
                <Col :span="8">
                    <div class="coin-change-list-item-time">{{item.time}}</div>
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
                <span>我的金币记录</span>
            </p>
            <Table height="400" :columns="columns" :data="rowData" class="sys-notice-table"></Table>
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
                modelCoinFlag: false,
                coinLoadingFlag: false,
                rankDataRed: [],
                rankDataBlack: [],
                pageData: {
                    totalData: 60,
                    pageSize: 10,
                    current: 1
                },
                modelFlag: false,
                itemData: [
                    {
                        num: '+10',
                        type: 'up',
                        desc: '写日志加 10 金币',
                        time: '2018-01-04 08:30:00'
                    },
                    {
                        num: '-10',
                        type: 'down',
                        desc: '没写写日志加 扣10 金币',
                        time: '2018-01-04 08:30:00'
                    },
                    {
                        num: '+500',
                        type: 'up',
                        desc: '写日志加 10 金币',
                        time: '2018-01-04 08:30:00'
                    },
                    {
                        num: '-500',
                        type: 'down',
                        desc: '没写写日志加 扣100 金币',
                        time: '2018-01-04 08:30:00'
                    },
                    {
                        num: '+10',
                        type: 'up',
                        desc: '写日志加 10 金币',
                        time: '2018-01-04 08:30:00'
                    }
                ],
                columns: [
                    {
                        title: '金币变更',
                        width: 100,
                        key: 'num',
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: params.row.type === 'up' ? '#19be6b' : '#ed3f14'
                                }
                            }, params.row.num);
                        }
                    },
                    {
                        title: '属性',
                        key: 'prop',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '说明',
                        key: 'desc'
                    },
                    {
                        title: '日期',
                        key: 'date',
                        width: 180,
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        key: 'people',
                        width: 80
                    }
                ],
                rowData: [
                    {
                        num: '+10',
                        type: 'up',
                        prop: '财富点',
                        desc: '写日志加 10 金币',
                        date: '2018-01-04 08:30:00',
                        people: '系统'
                    },
                    {
                        num: '-10',
                        type: 'down',
                        prop: '财富点',
                        desc: '写日志加 10 金币',
                        date: '2018-01-04 08:30:00',
                        people: '系统'
                    },
                    {
                        num: '+10',
                        type: 'up',
                        prop: '伯乐点',
                        desc: '写日志加 10 金币',
                        date: '2018-01-04 08:30:00',
                        people: '管理员'
                    },
                    {
                        num: '+10',
                        type: 'up',
                        prop: '财富点',
                        desc: '写日志加 10 金币',
                        date: '2018-01-04 08:30:00',
                        people: '系统'
                    },
                    {
                        num: '+10',
                        type: 'up',
                        prop: '财富点',
                        desc: '写日志加 10 金币',
                        date: '2018-01-04 08:30:00',
                        people: '系统'
                    },
                    {
                        num: '+10',
                        type: 'up',
                        prop: '财富点',
                        desc: '写日志加 10 金币',
                        date: '2018-01-04 08:30:00',
                        people: '系统'
                    },
                    {
                        num: '+10',
                        type: 'up',
                        prop: '财富点',
                        desc: '写日志加 10 金币',
                        date: '2018-01-04 08:30:00',
                        people: '系统'
                    },
                    {
                        num: '+10',
                        type: 'up',
                        prop: '财富点',
                        desc: '写日志加 10 金币',
                        date: '2018-01-04 08:30:00',
                        people: '系统'
                    },
                    {
                        num: '+10',
                        type: 'up',
                        prop: '财富点',
                        desc: '写日志加 10 金币',
                        date: '2018-01-04 08:30:00',
                        people: '系统'
                    },
                    {
                        num: '+10',
                        type: 'up',
                        prop: '财富点',
                        desc: '写日志加 10 金币',
                        date: '2018-01-04 08:30:00',
                        people: '系统'
                    }
                ]
            };
        },
        created() {
            this._getRankData();
        },
        methods: {
            _getRankData() {
                this.coinLoadingFlag = true;
                this.$http
                    .all([this.$http.get('/main/Ranking?page=1&pageSize=10000&type=1'), this.$http.get('/main/Ranking?page=1&pageSize=10000&type=2')])
                    .then(this.$http.spread((res1, res2) => {
                        if (res1.Success) {
                            this.rankDataBlack = res1.date;
                        }
                        if (res2.Success) {
                            this.rankDataRed = res2.date;
                        }
                    })).finally(() => {
                        this.coinLoadingFlag = false;
                    });
            },
            pageChangeHandler(current) {
                this.pageData.current = current;
            },
            pageSizeChangeHandler(size) {
                this.pageData.pageSize = size;
            },
            _getData() {
                let data = {
                    page: this.pageData.current,
                    pageSize: this.pageData.pageSize
                };
                this.$http.post('', data).then((res) => {
                });
            }
        },
        components: {
            coinRanking
        }
    };
</script>
