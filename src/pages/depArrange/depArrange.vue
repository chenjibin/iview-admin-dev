<template>
    <div class="#my-attendance">
        <Row :gutter="10">
            <Col :span="4">
            <Card>
                <Input v-model="filterText" size="large" placeholder="快速查找部门"></Input>
                <el-tree :data="treeData"
                         ref="treeDom"
                         :filter-node-method="filterNode"
                         :expand-on-click-node="false"
                         :highlight-current="true"
                         style="margin-top: 10px;"
                         @node-click="_treeNodeClickHandler"
                         :props="defaultProps"></el-tree>
            </Card>
            </Col>
            <Col :span="20">
            <Card>
                <Form ref="searchData" :model="filterOpt" inline :label-width="60">
                    <FormItem label="月份">
                        <DatePicker type="month"
                                    placeholder="筛选月份"
                                    @on-change="_monthDateChange"
                                    :value="filterOpt.monthDate"></DatePicker>
                    </FormItem>
                    <FormItem prop="name" label="部门">
                        <Input type="text"
                               @on-change="_inputDebounce"
                               v-model="filterOpt.organizeName"
                               placeholder="姓名"></Input>
                    </FormItem>
                    <FormItem label="设置状态">
                        <Select v-model="filterOpt.kqstates"
                                clearable
                                @on-change="_filterResultHandler"
                                placeholder="筛选状态"
                                style="width: 100px">
                            <Option value="2">未设置</Option>
                            <Option value="1">已设置</Option>
                        </Select>
                    </FormItem>
                </Form>
                <Table :columns="columns1"
                       :loading="tableLoading"
                       :height="tableHeight"
                       :data="pageData.list"></Table>
                <Page :total="pageData.totalCount"
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
        <Modal v-model="modelFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>排班</span>
            </p>
            <Table :columns="changeColums"
                   :data="changeData"
                   height="500"
                   width="868"
                   :loading="loading2"></Table>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<style lang="less">

</style>
<script>
    import moment from 'moment';
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    import _forEach from 'lodash/forEach';
    export default {
        name: 'depArrange',
        mixins: [pageMixin],
        watch: {
            filterText(val) {
                this.$refs.treeDom.filter(val);
            },
            'filterOpt.organizeId'() {
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
                filterOpt: {
                    monthDate: '',
                    organizeId: '',
                    organizeName: '',
                    kqstates: ''
                },
                modelFlag: false,
                monthData: '',
                userName: '',
                changeColums: [],
                changeData: [],
                columns1: [
                    {
                        title: '部门',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '排班月份',
                        key: 'monthdate',
                        align: 'center'
                    },
                    {
                        title: '审核状态',
                        key: 'status',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    color: params.row.status === '已设置' ? 'green' : 'red'
                                }
                            }, params.row.status);
                        }
                    },
                    {
                        title: '操作',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '排班设置',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'ios-gear',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._checkDetail(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
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
            this._getOrgTreeData().then(() => {
                this._getAttendanceData();
            });
        },
        methods: {
            _monthDateChange(val) {
                this.filterOpt.monthDate = val;
                this._filterResultHandler();
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },
            _getOrgTreeData() {
                return new Promise(resolve => {
                    this.$http.get('/organize/organizeTreeByUserForRiZhi').then((res) => {
                        console.log(res);
                        if (res.success) {
                            this.treeData = res.date;
                            this.filterOpt.organizeId = res.date[0].id;
                            resolve();
                        }
                    });
                });
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
                data.organizeId = this.filterOpt.organizeId;
                data.monthDate = this.filterOpt.monthDate;
                data.organizeName = this.filterOpt.organizeName;
                data.kqstates = this.filterOpt.kqstates;
                this.getList('/kq/getOrganizeArrangeStatistic', data);
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _treeNodeClickHandler(data) {
                this.filterOpt.organizeId = data.id;
                this.filterOpt.organizeName = data.text;
            },
            _filterResultHandler() {
                this.initPage();
                this._getAttendanceData();
            },
            _returnRenderFun() {
                return function (h, params) {
                    console.log(params)
                    return h('div', params.row[params.column.key].kq_plan);
                };
            },
            _checkDetail(obj) {
                this.loading2 = true;
                let month = obj.monthdate;
                this.monthData = month;
                this.userName = obj.organizename;
                let data = {};
                data.id = obj.id;
                data.record_month = month;
                data.organizeName = obj.organizename;
                data.status = obj.status;
                console.log(data)
                this.$http.get('/kq/organizeArrangeStatistic', {params: data}).then((res) => {
                    console.log(res);
                    let storeColum = [
                        {
                            title: '姓名',
                            key: 'name',
                            width: 80,
                            fixed: 'left'
                        }
                    ];
                    res.days.forEach((item, index) => {
                        let storeObj = {};
                        storeObj.title = item;
                        storeObj.key = 'day' + index;
                        storeObj.width = 80;
                        storeObj.align = 'center';
                        storeObj.render = this._returnRenderFun();
                        storeColum.push(storeObj);
                    });
                    let storeData = [];
                    _forEach(res.arrangeMap, (value, key) => {
                        let storeObj = {};
                        storeObj.name = key;
                        value.forEach((item, index) => {
                            storeObj['day' + index] = item;
                        });
                        storeData.push(storeObj);
                    })
                    this.changeData = storeData
                    this.changeColums = storeColum;
                    console.log(storeData);
                }).finally(() => {
                    this.loading2 = false;
                });
                this.modelFlag = true;
            }
        },
        components: {}
    };
</script>
