<template>
    <div class="#my-attendance">
        <Row :gutter="10">
            <Col :span="4">
                <fs-dep-tree url="/organize/organizeTreeCertainVm"
                             @node-change="_nodeChangeHandler($event)"
                             :defaultProps="defaultProps"></fs-dep-tree>
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
                    <FormItem>
                        <ButtonGroup>
                            <Button type="ghost" @click="_createMonthOpen" v-if="accessBtn.indexOf(24) > -1">
                                <Icon type="plus-round"></Icon>
                                新建
                            </Button>
                            <Button type="warning" @click="_delMonthOpen" v-if="accessBtn.indexOf(25) > -1">
                                <Icon type="ios-trash-outline"></Icon>
                                删除
                            </Button>
                            <Button type="ghost" @click="addPersonModalFlag = true" v-if="accessBtn.indexOf(26) > -1">
                                <Icon type="plus-round"></Icon>
                                添加个人
                            </Button>
                            <Button type="ghost" @click="addDepModalFlag = true" v-if="accessBtn.indexOf(27) > -1">
                                <Icon type="plus-round"></Icon>
                                添加部门
                            </Button>
                            <Button type="warning"
                                    :disabled="!chooseDataArr.length"
                                    v-if="accessBtn.indexOf(28) > -1"
                                    @click="_delDepChoose">
                                <Icon type="ios-trash-outline"></Icon>
                                删除部门
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>
                <Table :columns="columns1"
                       :loading="tableLoading"
                       :height="tableHeight"
                       @on-selection-change="_tableSelectChange"
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
        <Modal v-model="deleteModalFlag"
               width="300"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{allType === 'del' ? '删除' : '新建'}}月份</span>
            </p>
            <Form >
                <FormItem label="月份">
                    <DatePicker type="month"
                                placeholder="月份"
                                @on-change="_deleteMonthChange"
                                :value="deleteMonth"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        v-if="allType === 'del'"
                        :loading="deleteLoading"
                        @click="_confirmDelete">
                    <span v-if="!deleteLoading">确认删除</span>
                    <span v-else>正在删除...</span>
                </Button>
                <Button type="primary"
                        v-if="allType === 'create'"
                        :loading="deleteLoading"
                        @click="_confirmCreate">
                    <span v-if="!deleteLoading">确认新建</span>
                    <span v-else>正在新建...</span>
                </Button>
                <Button type="ghost" style="margin-left: 8px" @click="deleteModalFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="addDepModalFlag"
               width="300"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>添加部门</span>
            </p>
            <Form :label-width="80">
                <FormItem label="月份">
                    <DatePicker type="month"
                                placeholder="月份"
                                @on-change="_addDepMonthChange"
                                :value="addDepForm.month"></DatePicker>
                </FormItem>
                <FormItem label="部门名称">
                    <Input type="text"
                           v-model="addDepForm.organizeName"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        :loading="deleteLoading"
                        @click="_confirmAddDep">
                    <span v-if="!deleteLoading">确认添加</span>
                    <span v-else>正在添加...</span>
                </Button>
                <Button type="ghost" style="margin-left: 8px" @click="addDepModalFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="addPersonModalFlag"
               width="300"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>添加个人</span>
            </p>
            <Form :label-width="80">
                <FormItem label="月份">
                    <DatePicker type="month"
                                placeholder="月份"
                                @on-change="_addPersonMonthChange"
                                :value="addPersonForm.month"></DatePicker>
                </FormItem>
                <FormItem label="员工姓名">
                    <Input type="text"
                           v-model="addPersonForm.userName"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        :loading="deleteLoading"
                        @click="_confirmAddPerson">
                    <span v-if="!deleteLoading">确认添加</span>
                    <span v-else>正在添加...</span>
                </Button>
                <Button type="ghost" style="margin-left: 8px" @click="addPersonModalFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style lang="less">

</style>
<script>
    import moment from 'moment';
    import pageMixin from '@/mixins/pageMixin';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import debounce from 'lodash/debounce';
    import _forEach from 'lodash/forEach';
    const NOW_MONTH = moment().format('YYYY-MM');
    export default {
        name: 'depArrange',
        mixins: [pageMixin],
        watch: {
            'filterOpt.organizeId'() {
                this._filterResultHandler();
            }
        },
        data () {
            return {
                allType: 'del',
                loading: false,
                loading2: false,
                deleteLoading: false,
                importLoading: false,
                strangeModalFlag: false,
                deleteModalFlag: false,
                addDepModalFlag: false,
                addPersonModalFlag: false,
                btnConfirmDis: false,
                deleteMonth: NOW_MONTH,
                addDepForm: {
                    month: NOW_MONTH,
                    organizeName: ''
                },
                addPersonForm: {
                    month: NOW_MONTH,
                    userName: ''
                },
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
                chooseDataArr: [],
                sendId: '',
                sendMonth: '',
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
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
                },
                accessBtn: []
            };
        },
        created() {
            this.accessBtn = this.$route.meta.btn.map(x => x.id);
            this._setTableHeight();
        },
        methods: {
            _nodeChangeHandler(node) {
                this.filterOpt.organizeId = node.id === 1 ? '' : node.id;
            },
            _confirmAddPerson() {
                this.deleteLoading = true;
                this.$http.post('/kq/addSingleArrangeByMonth', this.addPersonForm).then((res) => {
                    if (res.success) {
                        this.addPersonModalFlag = false;
                        this.$Message.success('个人添加成功!');
                        this._getAttendanceData();
                    }
                }).finally(() => {
                    this.deleteLoading = false;
                });
            },
            _addPersonMonthChange(date) {
                this.addPersonForm.month = date;
            },
            _confirmAddDep() {
                this.deleteLoading = true;
                this.$http.post('/kq/addOrganizeArrangeByMonth', this.addDepForm).then((res) => {
                    if (res.success) {
                        this.addDepModalFlag = false;
                        this.$Message.success('部门添加成功!');
                        this._getAttendanceData();
                    }
                }).finally(() => {
                    this.deleteLoading = false;
                });
            },
            _addDepMonthChange(date) {
                this.addDepForm.month = date;
            },
            _delDepChoose() {
                let storeArr = this.chooseDataArr.map(x => x.id);
                let data = {};
                data.ids = storeArr.join(',');
                this.$http.post('/kq/deleteOrganizeArrange', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('删除成功!');
                        this._getAttendanceData();
                        this.chooseDataArr = [];
                    }
                });
            },
            _createMonthOpen() {
                this.allType = 'create';
                this.deleteModalFlag = true;
            },
            _delMonthOpen() {
                this.allType = 'del';
                this.deleteModalFlag = true;
            },
            _deleteMonthChange(date) {
                this.deleteMonth = date;
            },
            _confirmCreate() {
                this.deleteLoading = true;
                let data = {};
                data.month = this.deleteMonth;
                this.$http.post('/kq/addArrangeTableByMonth', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('创建成功!');
                        this._getAttendanceData();
                        this.deleteModalFlag = false;
                    }
                }).finally(() => {
                    this.deleteLoading = false;
                });
            },
            _confirmDelete() {
                this.deleteLoading = true;
                let data = {};
                data.month = this.deleteMonth;
                this.$http.post('/kq/ArrangeDelete', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('删除成功!');
                        this._getAttendanceData();
                        this.deleteModalFlag = false;
                    }
                }).finally(() => {
                    this.deleteLoading = false;
                });
            },
            _tableSelectChange(data) {
                this.chooseDataArr = data;
            },
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
                }).finally(() => {
                    this.btnConfirmDis = false;
                });
            },
            _settingStrangeDay(params) {
                this.strangeModalFlag = true;
                this.strangeSettingForm.id = params.row[params.column.key].id;
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
                        this.userIds = res.data.userIds;
                        this.sendId = res.data.id;
                        this.sendMonth = res.data.month;
                        let storeColum = [
                            {
                                title: '姓名',
                                key: 'name',
                                width: 80,
                                fixed: 'left'
                            }
                        ];
                        res.data.days.forEach((item, index) => {
                            let storeObj = {};
                            storeObj.title = item;
                            storeObj.key = 'day' + index;
                            storeObj.width = 80;
                            storeObj.align = 'center';
                            storeObj.render = this._returnRenderFun();
                            storeColum.push(storeObj);
                        });
                        let storeData = [];
                        _forEach(res.data.arrangeMap, (value, key) => {
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
        components: {
            fsDepTree
        }
    };
</script>
