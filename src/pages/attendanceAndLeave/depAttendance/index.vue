<template>
    <div class="#my-attendance">
        <Row :gutter="10">
            <Col :span="4">
                <fs-dep-tree url="/organize/organizeTreeByUserForRiZhi"
                             @node-change="_nodeChangeHandler($event)"
                             :defaultProps="defaultProps"></fs-dep-tree>
            </Col>
            <Col :span="20">
                <Card>
                    <Form ref="searchData" :model="searchData" inline :label-width="60">
                        <FormItem prop="name" label="姓名">
                            <Input type="text"
                                   @on-change="_inputDebounce"
                                   v-model="searchData.userName"
                                   placeholder="姓名"></Input>
                        </FormItem>
                    </Form>
                    <Table :columns="columns1"
                           :loading="tableLoading"
                           :height="tableHeight"
                           @on-row-click="_checkDetail"
                           :row-class-name="_returnRowClass"
                           :data="pageData.list"></Table>
                    <Page :total="pageData.totalCount"
                          :current="pageData.page"
                          @on-change="_setPage"
                          @on-page-size-change="_setPageSize"
                          :page-size="pageData.pageSize"
                          placement="top"
                          show-sizer
                          show-total
                          show-elevator
                          style="margin-top: 16px;"></Page>
                </Card>
            </Col>
        </Row>
        <Modal v-model="modelFlag" width="1200" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{userName + ' ' + monthData}} 考勤</span>
            </p>
            <Table :columns="columns2"
                   :data="attendanceDetail"
                   height="500"
                   :row-class-name="_returnInnerRowClass"
                   :loading="loading2"></Table>
            <div slot="footer"></div>
        </Modal>
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
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import moment from 'moment';
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    export default {
        name: 'depAttendance',
        mixins: [pageMixin],
        watch: {
            filterText(val) {
                this.$refs.treeDom.filter(val);
            },
            'searchData.depId'() {
                this._filterResultHandler();
            }
        },
        data () {
            return {
                filterText: '',
                loading: false,
                loading2: false,
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                tableHeight: 300,
                searchData: {
                    userName: '',
                    depId: '',
                    organizeName: ''
                },
                modelFlag: false,
                monthData: '',
                userName: '',
                columns1: [
                    {
                        title: '部门',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '员工姓名',
                        key: 'user_name',
                        align: 'center'
                    },
                    {
                        title: '记录月份',
                        key: 'record_month',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('span', moment(params.row.record_month).format('YYYY-MM'));
                        }
                    },
                    {
                        title: '迟到',
                        key: 'late_times',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '早退',
                        key: 'leave_early',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '漏打卡',
                        key: 'forget_times',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '请假(天)',
                        key: 'leave_day',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '出勤(天)',
                        key: 'regular_day',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '出差(天)',
                        key: 'out_off_day',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '旷工(天)',
                        key: 'absent_off_day',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '审核状态',
                        key: 'status',
                        width: 120,
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
                        width: 210,
                        render: (h, params) => {
                            if (params.row.kq_re) {
                                let flag = +params.row.c_count || +params.row.z_count || +params.row.l_count;
                                return h('Tag', {
                                    props: {
                                        color: flag ? 'red' : 'green'
                                    },
                                    style: {
                                        fontSize: '14px',
                                        height: 'auto'
                                    }
                                }, params.row.kq_re);
                            }
                        }
                    },
                    {
                        title: '日期',
                        key: 'k_date',
                        align: 'center',
                        width: 110
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
                        title: '备注说明',
                        key: 'describeex',
                        align: 'center'
                    },
                    {
                        title: '审核状态',
                        key: 'offdaytype',
                        width: 120,
                        align: 'center'
                    }
                ],
                attendanceList: [],
                attendanceDetail: []
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _nodeChangeHandler(node) {
                this.searchData.depId = node.id;
                this.searchData.organizeName = node.text;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _setPage(page) {
                this.pageData.page = page;
                this._getAttendanceData();
            },
            _setPageSize(size) {
                this.pageData.pageSize = size;
                this._getAttendanceData();
            },
            _getAttendanceData() {
                let data = {};
                data.userName = this.searchData.userName;
                data.organizeId = this.searchData.depId;
                data.organizeName = this.searchData.organizeName;
                this.getList('/kq/getStatisticListByOrgName', data);
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this._getAttendanceData();
            },
            _returnInnerRowClass(row) {
                let className = 'my-attendance-inner';
                if (row.absent_off_day) {
                    className += ' error';
                }
                return className;
            },
            _checkDetail(obj) {
                this.loading2 = true;
                let month = moment(obj.record_month).format('YYYY-MM');
                this.monthData = month;
                this.userName = obj.user_name;
                let data = {};
                data.user_name = obj.user_name;
                data.record_month = month;
                this.$http.get('/kq/singleStatistic', {params: data}).then((res) => {
                    if (res.success) {
                        this.attendanceDetail = res.data.userRecords;
                    }
                }).finally(() => {
                    this.loading2 = false;
                });
                this.modelFlag = true;
            },
            _returnRowClass() {
                return 'fs-row';
            }
        },
        components: {
            fsDepTree
        }
    };
</script>
