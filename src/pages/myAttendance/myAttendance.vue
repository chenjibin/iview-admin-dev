<template>
    <div class="#my-attendance">
        <Card>
            <Table :columns="columns1"
                   :data="data1"
                   :loading="loading"
                   height="700"
                   @on-row-click="_checkDetail"
                   :row-class-name="_returnRowClass"
                   style="margin-bottom: 10px;"></Table>
            <Page :total="pageData.totalCount"
                  @on-change="_pageChangeHandler"></Page>
            <Modal v-model="modelFlag" width="900" :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>2018-1 考勤</span>
                </p>
                <div slot="footer"></div>
            </Modal>
        </Card>
    </div>
</template>
<style lang="less">
    .ivu-table  {
        .fs-row {
            cursor: pointer;
        }
    }
</style>
<script>
    export default {
        name: 'myAttendance',
        data () {
            return {
                loading: false,
                pageData: {
                    totalCount: 10,
                    page: 1,
                    pageSize: 10
                },
                modelFlag: false,
                columns1: [
                    {
                        title: '记录月份',
                        key: 'date',
                        align: 'center'
                    },
                    {
                        title: '迟到',
                        key: 'age',
                        align: 'center'
                    },
                    {
                        title: '早退',
                        key: 'address',
                        align: 'center'
                    },
                    {
                        title: '漏打卡',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '请假(天)',
                        key: 'age',
                        align: 'center'
                    },
                    {
                        title: '出勤(天)',
                        key: 'address',
                        align: 'center'
                    },
                    {
                        title: '出差(天)',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '旷工(天)',
                        key: 'age',
                        align: 'center'
                    },
                    {
                        title: '审核状态',
                        key: 'address',
                        align: 'center'
                    }
                ],
                attendanceList: null,
                data1: [
                    {
                        name: '1',
                        age: 18,
                        address: '1',
                        date: '2016-10-03'
                    },
                    {
                        name: '1',
                        age: 24,
                        address: '1',
                        date: '2016-10-01'
                    },
                    {
                        name: '1',
                        age: 30,
                        address: '1',
                        date: '2016-10-02'
                    },
                    {
                        name: '1',
                        age: 26,
                        address: '1',
                        date: '2016-10-04'
                    },
                    {
                        name: '1',
                        age: 18,
                        address: '1',
                        date: '2016-10-03'
                    },
                    {
                        name: '1',
                        age: 24,
                        address: '1',
                        date: '2016-10-01'
                    },
                    {
                        name: '1',
                        age: 30,
                        address: '1',
                        date: '2016-10-02'
                    },
                    {
                        name: '1',
                        age: 26,
                        address: '1',
                        date: '2016-10-04'
                    },
                    {
                        name: '1',
                        age: 18,
                        address: '1',
                        date: '2016-10-03'
                    },
                    {
                        name: '1',
                        age: 24,
                        address: '1',
                        date: '2016-10-01'
                    },
                    {
                        name: '1',
                        age: 30,
                        address: '1',
                        date: '2016-10-02'
                    },
                    {
                        name: '1',
                        age: 26,
                        address: '1',
                        date: '2016-10-04'
                    }
                ]
            };
        },
        created() {
            this._getAttendanceList(1);
        },
        methods: {
            _pageChangeHandler(page) {
                this._getAttendanceList(page);
                console.log(page);
            },
            _checkDetail(obj) {
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
                        this.attendanceList = res.dateList;
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
