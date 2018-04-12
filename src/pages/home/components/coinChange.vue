<template>
    <Card class="coin-change">
        <Row type="flex" justify="space-between" class="coin-change-header">
            <Col>
                <p class="coin-change-title">金币奖惩记录</p>
            </Col>
            <Col>
                <Button type="primary"
                        shape="circle"
                        icon="ios-flag-outline"
                        style="margin-right: 8px;"
                        @click.stop="_openCoinRanking">金币排行</Button>
                <Button type="primary"
                        shape="circle"
                        icon="ios-search"
                        @click.stop="_openMyCoinState">我的金币动态</Button>
            </Col>
        </Row>
        <div class="coin-change-list">
            <fs-table-page :columns="coinRecordCol"
                           url="/coin/getCredit"></fs-table-page>
        </div>
        <Modal v-model="modelCoinFlag" width="800" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>金币排行榜</span>
            </p>
            <Row :gutter="6" style="margin-bottom: 10px;">
                <Col :md="12" :lg="12">
                    <coin-ranking tag-color="#19be6b"
                                  ref="redRanking"
                                  v-if="modelCoinFlag"
                                  coin-title="金币排行红榜"
                                  url="/main/Ranking?type=1">
                    </coin-ranking>
                </Col>
                <Col :md="12" :lg="12">
                    <coin-ranking tag-color="#ed3f14"
                                  ref="blackRanking"
                                  v-if="modelCoinFlag"
                                  coin-title="金币排行黑榜"
                                  url="/main/Ranking?type=2">
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
            <fs-table-page :columns="columns"
                           ref="myCoinState"
                           v-if="modelFlag"
                           url="/main/getMyCoinLogList"></fs-table-page>
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
    }
</style>
<script>
    import coinRanking from './coinRanking';
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        data () {
            return {
                modelCoinFlag: false,
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
                coinRecordCol: [
                    {
                        title: '姓名',
                        key: 'user_name',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '金币动态',
                        key: 'opt_num',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            let color = params.row.flag ? '#ed3f14' : '#19be6b';
                            return h('span', {
                                style: {
                                    color: color
                                }
                            }, params.row.opt_num);
                        }
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
                    }
                ],
                rowData: []
            };
        },
        methods: {
            _openCoinRanking() {
                this.modelCoinFlag = true;
            },
            _openMyCoinState() {
                // this.$refs.myCoinState.getListData();
                this.modelFlag = true;
            }
        },
        components: {
            coinRanking,
            fsTablePage
        }
    };
</script>
