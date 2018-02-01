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
                <span>{{'【' + organizeName +  '】' + monthData}}排班</span>
            </p>
            <Table :columns="changeColums"
                   :data="changeData"
                   height="450"
                   width="868"
                   :loading="loading2"></Table>
            <div slot="footer">
                <Button type="primary"
                        :disabled="loading2"
                        :loading="importLoading"
                        v-if="opSataus === '未设置'"
                        @click="_importLastMonth">
                    <span v-if="!importLoading">导入上月设置</span>
                    <span v-else>正在导入...</span>
                </Button>
                <Button type="primary"
                        :disabled="loading2"
                        v-if="opSataus === '未设置'"
                        @click="_completeThisMonth">完成 【{{organizeName}}】 该月排班</Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="strangeModalFlag"
               width="400"
               :styles="{top: '160px', zIndex: 100}"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 16px">
                <span>编辑出勤信息</span>
            </p>
            <Form :model="strangeSettingForm" :label-width="80">
                <FormItem label="出勤类型">
                    <Select v-model="strangeSettingForm.type" clearable>
                        <Option value="休息">休息</Option>
                        <Option value="上班">上班</Option>
                        <Option value="法假">法假</Option>
                        <Option value="旷工">旷工</Option>
                        <Option value="无薪假" >无薪假</Option>
                    </Select>
                </FormItem>
                <FormItem label="天数">
                    <Select v-model="strangeSettingForm.quality" clearable>
                        <Option value="1">1天</Option>
                        <Option value="0.5">0.5天</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        :disabled="btnConfirmDis"
                        @click="_confirmStrangeSetting">确认设置</Button>
                <Button type="ghost" style="margin-left: 8px"
                        @click="strangeModalFlag = false">取消</Button>
            </div>
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
                importLoading: false,
                strangeModalFlag: false,
                btnConfirmDis: false,
                treeData: [],
                strangeSettingForm: {
                    type: '休息',
                    quality: '1',
                    id: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                tableHeight: 300,
                filterOpt: {
                    monthDate: '',
                    organizeId: '',
                    // organizeName: '',
                    kqstates: ''
                },
                modelFlag: false,
                monthData: '',
                organizeName: '',
                changeColums: [],
                changeData: [],
                opSataus: '',
                userIds: [],
                sendId: '',
                sendMonth: '',
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
                getDetailData: {
                    id: '',
                    record_month: '',
                    organizeName: '',
                    status: ''
                }
            };
        },
        created() {
            this._setTableHeight();
            this._getOrgTreeData().then(() => {
                this._getAttendanceData();
            });
        },
        methods: {
            _importLastMonth() {
                this.loading2 = true;
                this.importLoading = true;
                let data = {};
                data.userIds = this.userIds.join(',');
                data.month = this.sendMonth;
                this.$http.post('/kq/exportLastMonthMsg', data).then((res) => {
                    if (res.success) {
                        this._getDetailData();
                    }
                    console.log(res);
                }).finally(() => {
                    this.importLoading = false;
                });
            },
            _confirmStrangeSetting() {
                this.btnConfirmDis = true;
                this.$http.post('/kq/updateArrangeExceptionType', this.strangeSettingForm).then((res) => {
                    if (res.success) {
                        this.$Message.success('设置成功!');
                        this._getDetailData();
                        this.strangeModalFlag = false;
                    }
                    console.log(res);
                }).finally(() => {
                    this.btnConfirmDis = false;
                });
                console.log(this.strangeSettingForm);
            },
            _settingStrangeDay(params) {
                this.strangeModalFlag = true;
                this.strangeSettingForm.id = params.row[params.column.key].id;
                console.log(params);
            },
            _completeThisMonth() {
                let data = {};
                data.userIds = this.userIds.join(',');
                data.month = this.sendMonth;
                data.id = this.sendId;
                this.$http.post('/kq/completeOrganizeArrangeSetup', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('设置成功!');
                        this.modelFlag = false;
                        this._getAttendanceData();
                    }
                    console.log(res);
                });
            },
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
                    this.$http.get('/organize/organizeTree?fatherId=-1').then((res) => {
                        console.log(res);
                        if (res.success) {
                            this.treeData = res.date;
                            this.filterOpt.organizeId = '';
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
                let vm = this;
                return function (h, params) {
                    let content = '';
                    let color = '';
                    let flag = !!params.row[params.column.key];
                    if (flag) {
                        if (params.row[params.column.key].exceptiontype) {
                            content = params.row[params.column.key].exceptiontype;
                            color = '#ff9900';
                        } else {
                            content = params.row[params.column.key].kq_plan;
                            if (content === '休息') {
                                color = '#2d8cf0';
                            } else {
                                color = '#495060';
                            }
                        }
                    }
                    return h('div', {
                        on: {
                            click: function () {
                                vm._settingStrangeDay(params);
                            }
                        },
                        style: {
                            color: color,
                            cursor: 'pointer'
                        }
                    }, content);
                };
            },
            _getDetailData() {
                this.loading2 = true;
                this.$http.get('/kq/organizeArrangeStatistic', {params: this.getDetailData}).then((res) => {
                    if (res.success) {
                        console.log(res);
                        this.userIds = res.date.userIds;
                        this.sendId = res.date.id;
                        this.sendMonth = res.date.month;
                        let storeColum = [
                            {
                                title: '姓名',
                                key: 'name',
                                width: 80,
                                fixed: 'left'
                            }
                        ];
                        res.date.days.forEach((item, index) => {
                            let storeObj = {};
                            storeObj.title = item;
                            storeObj.key = 'day' + index;
                            storeObj.width = 80;
                            storeObj.align = 'center';
                            storeObj.render = this._returnRenderFun();
                            storeColum.push(storeObj);
                        });
                        let storeData = [];
                        _forEach(res.date.arrangeMap, (value, key) => {
                            let storeObj = {};
                            storeObj.name = key;
                            if (value.length) {
                                value.forEach((item, index) => {
                                    storeObj['day' + index] = item;
                                });
                            }
                            storeData.push(storeObj);
                        });
                        this.changeData = storeData;
                        this.changeColums = storeColum;
                    }
                }).finally(() => {
                    this.loading2 = false;
                });
            },
            _checkDetail(obj) {
                let month = obj.monthdate;
                this.opSataus = obj.status;
                this.monthData = month;
                this.organizeName = obj.organizename;
                this.getDetailData.id = obj.id;
                this.getDetailData.record_month = month;
                this.getDetailData.organizeName = obj.organizename;
                this.getDetailData.status = obj.status;
                this._getDetailData();
                this.modelFlag = true;
            }
        },
        components: {}
    };
</script>
