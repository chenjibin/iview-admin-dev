<template>
    <div class="#my-attendance">
        <Card>
            <Table :columns="columns1"
                   :data="attendanceList"
                   :loading="loading"
                   @on-row-click="_checkDetail"
                   :row-class-name="_returnRowClass"
                   style="margin-bottom: 10px;"></Table>
            <Page :total="pageData.totalCount"
                  @on-change="_pageChangeHandler"></Page>
            <Modal v-model="modelFlag" width="900" :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{monthData}} 考勤</span>
                </p>
                <Table :columns="columns2"
                       :data="attendanceDetail"
                       height="600"
                       :row-class-name="_returnInnerRowClass"
                       :loading="loading2"></Table>
                <div slot="footer"></div>
            </Modal>
        </Card>
    </div>
</template>
<style lang="less">
    .ivu-table  {
        .fs-row {
            font-size: 16px;
            cursor: pointer;
        }
        .my-attendance-inner {
            font-size: 14px;
            &.error td{
                background-color: #ff0036;
                color: #fff;
            }
        }
    }
</style>
<script>
    import moment from 'moment';
    export default {
        name: 'myAttendance',
        data () {
            return {
                loading: false,
                loading2: false,
                pageData: {
                    totalCount: 0,
                    page: 1,
                    pageSize: 12
                },
                modelFlag: false,
                monthData: '',
                columns1: [
                    {
                        title: '记录月份',
                        key: 'record_month',
                        align: 'center',
                        width: '120',
                        render: (h, params) => {
                            return h('span', moment(params.row.record_month).format('YYYY-MM'));
                        }
                    },
                    {
                        title: '迟到',
                        key: 'late_times',
                        align: 'center'
                    },
                    {
                        title: '早退',
                        key: 'leave_early',
                        align: 'center'
                    },
                    {
                        title: '漏打卡',
                        key: 'forget_times',
                        align: 'center'
                    },
                    {
                        title: '请假(天)',
                        key: 'leave_day',
                        align: 'center'
                    },
                    {
                        title: '出勤(天)',
                        key: 'regular_day',
                        align: 'center'
                    },
                    {
                        title: '出差(天)',
                        key: 'out_off_day',
                        align: 'center'
                    },
                    {
                        title: '旷工(天)',
                        key: 'absent_off_day',
                        align: 'center'
                    },
                    {
                        title: '审核状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    color: params.row.status === '审核完毕' ? 'green' : 'red'
                                }
                            }, params.row.status);
                        }
                    }
                ],
                columns2: [
                    {
                        title: '打卡记录',
                        key: 'kq_re',
                        width: '240',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.kq_re) {
                                let flag = +params.row.c_count || +params.row.z_count || +params.row.l_count;
                                return h('Tag', {
                                    props: {
                                        color: flag ? 'red' : 'green'
                                    },
                                    style: {
                                        fontSize: '14px'
                                    }
                                }, params.row.kq_re);
                            }
                        }
                    },
                    {
                        title: '日期',
                        key: 'k_date',
                        align: 'center',
                        width: '110'
                    },
                    {
                        title: '迟到',
                        key: 'c_count',
                        align: 'center'
                    },
                    {
                        title: '早退',
                        key: 'z_count',
                        align: 'center'
                    },
                    {
                        title: '漏打卡',
                        key: 'l_count',
                        align: 'center'
                    },
                    {
                        title: '审核状态',
                        key: 'offdaytype',
                        align: 'center'
                    },
                    {
                        title: '备注说明',
                        key: 'describeex',
                        align: 'center'
                    }
                ],
                attendanceList: [],
                attendanceDetail: []
            };
        },
        created() {
            this._getAttendanceList(1);
        },
        methods: {
            _returnInnerRowClass(row) {
                let className = 'my-attendance-inner';
                if (row.absent_off_day) {
                    className += ' error';
                }
                return className;
            },
            _pageChangeHandler(page) {
                this._getAttendanceList(page);
            },
            _checkDetail(obj) {
                this.loading2 = true;
                let month = moment(obj.record_month).format('YYYY-MM');
                this.monthData = month;
                let data = {
                    month: month
                };
                this.$http.get('/arrange/getMyKqLogMonth', {params: data}).then((res) => {
                    if (res.success) {
                        this.attendanceDetail = res.data;
                    }
                }).finally(() => {
                    this.loading2 = false;
                });
                this.modelFlag = true;
            },
            _getAttendanceList(page) {
                this.loading = true;
                let data = {
                    page: page,
                    pageSize: this.pageData.pageSize
                };
                this.$http.get('/arrange/getPersonStatistic', {params: data}).then((res) => {
                    if (res.success) {
                        this.attendanceList = res.data;
                        this.pageData.totalCount = res.totalCount;
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            _returnRowClass() {
                return 'fs-row';
            }
        },
        components: {}
    };
</script>
