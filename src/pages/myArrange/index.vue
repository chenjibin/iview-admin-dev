<template>
    <div id="my-arrange">
        <Card :dis-hover="true">
            <template v-for="list in dateList">
                <h2 class="year-title">{{list.year}}</h2>
                <Row :gutter="10" style="margin-bottom: 24px;">
                    <Col :lg="4" :md="6" :sm="8" :xs="12" v-for="(date, dateIndex) in list.date" :key="'date-' + dateIndex">
                        <Card class="my-arrange-card" @click.native="_cardClick(date)">
                            <p class="month">{{date.date}}</p>
                            <Tag color="green" @click.native="_cardClick(date)" v-if="date.type === '已设置'">{{date.type}}</Tag>
                            <Tag color="red"  v-else>{{date.type}}</Tag>
                        </Card>
                    </Col>
                </Row>
            </template>
            <Modal v-model="modelFlag" width="900" :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{arrangeDate}} 排班表</span>
                </p>
                <Table :columns="columnsData"
                       :data="tableData"
                       :loading="loading"
                       :disabled-hover="true"></Table>
                <div slot="footer">
                </div>
            </Modal>
        </Card>
    </div>
</template>
<style lang="less">
    #my-arrange {
        .year-title {
            margin-bottom: 16px;
        }
        .my-arrange-card {
            cursor: pointer;
            user-select: none;
            margin-bottom: 10px;
            text-align: center;
            .month {
                font-size: 18px;
                font-weight: 700;
            }
        }

    }
</style>
<script>
    import moment from 'moment';
    import dateMixin from '@/mixins/dateMixin';
    export default {
        name: 'myArrange',
        mixins: [dateMixin],
        data () {
            return {
                loading: false,
                modelFlag: false,
                arrangeDate: null,
                dateList: [],
                tableData: [],
                columnsData: [
                    {
                        title: '周日',
                        render: this._rowRender(0),
                        align: 'center'
                    },
                    {
                        title: '周一',
                        render: this._rowRender(1),
                        align: 'center'
                    },
                    {
                        title: '周二',
                        render: this._rowRender(2),
                        align: 'center'
                    },
                    {
                        title: '周三',
                        render: this._rowRender(3),
                        align: 'center'
                    },
                    {
                        title: '周四',
                        render: this._rowRender(4),
                        align: 'center'
                    },
                    {
                        title: '周五',
                        render: this._rowRender(5),
                        align: 'center'
                    },
                    {
                        title: '周六',
                        render: this._rowRender(6),
                        align: 'center'
                    }
                ]
            };
        },
        created() {
            this._getArrangeList();
        },
        methods: {
            _rowRender(i) {
                return (h, params) => {
                    if (params.row['day' + i].day) {
                        let typeDom;
                        let type = params.row['day' + i].type;
                        if (type === '上班') {
                            typeDom = h('Tag', {
                                props: {
                                    color: 'green'
                                }
                            }, type);
                        } else if (type === '休息' || type === '法假') {
                            typeDom = h('Tag', {
                                props: {
                                    color: 'blue'
                                }
                            }, type);
                        } else {
                            typeDom = h('Tag', {
                                props: {
                                    color: 'yellow'
                                }
                            }, type);
                        }
                        return h('div', {
                            class: ['flex-center'],
                            style: {
                                padding: '16px 0',
                                whiteSpace: 'nowrap'
                            }
                        }, [
                            h('span', params.row['day' + i].day),
                            typeDom
                        ]);
                    } else {
                        return h();
                    }
                };
            },
            _cardClick(date) {
                if (date.type === '未设置') return;
                this.arrangeDate = date.date;
                this.modelFlag = true;
                this._getArrangeDetail(date.date);
            },
            _getArrangeDetail(time) {
                this.loading = true;
                this.$http.get('/arrange/getOneMonthArrange', {params: {month: time}}).then((res) => {
                    if (res.success) {
                        let year = moment(time).year();
                        let month = moment(time).month();
                        this.tableData = this.returnDateDetail(year, month, res.dateList);
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            _getArrangeList() {
                this.$http.get('/arrange/getArrangeStatistic').then((res) => {
                    if (res.success) {
                        this.dateList = res.dateList;
                    }
                });
            }
        },
        components: {
        }
    };
</script>
