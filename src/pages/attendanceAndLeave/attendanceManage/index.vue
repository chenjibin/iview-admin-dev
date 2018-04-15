<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="姓名">
                    <Input type="text"
                           v-model="filterOpt.userName.value"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="考勤月份">
                    <DatePicker type="month"
                                placeholder="筛选考勤月份"
                                @on-change="filterOpt.monthDate.value = $event"
                                :value="filterOpt.monthDate.value"></DatePicker>
                </FormItem>
                <FormItem label="部门">
                    <Input type="text"
                           v-model="filterOpt.organizeName.value"
                           placeholder="筛选部门"></Input>
                </FormItem>
                <FormItem label="岗位">
                    <Input type="text"
                           v-model="filterOpt.postName.value"
                           placeholder="筛选岗位"></Input>
                </FormItem>
                <FormItem label="审核状态">
                    <Select v-model="filterOpt.kqstates.value"
                            clearable
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option value="2">审核完毕</Option>
                        <Option value="1">未审核</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <ButtonGroup>
                        <Button type="ghost" @click="importModalFlag = true">
                            <Icon type="ios-cloud-upload-outline"></Icon>
                            导入
                        </Button>
                        <Button type="ghost" @click="exportModalFlag = true">
                            <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
                            <Icon type="ios-cloud-download-outline"></Icon>
                            导出
                        </Button>
                        <Button type="warning" @click="deleteModalFlag = true">
                            <Icon type="ios-trash-outline"></Icon>
                            删除
                        </Button>
                        <Button type="error"
                                :disabled="!chooseDataArr.length"
                                @click="_delAttendanceInfo">
                            <Icon type="ios-trash-outline"></Icon>
                            删除个人
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           :choosearray.sync="chooseDataArr"
                           ref="attendanceTable"
                           url="/kq/getStatisticList"></fs-table-page>
            <Modal v-model="importModalFlag"
                   width="400"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>导入考勤表</span>
                </p>
                <Upload
                        type="drag"
                        :show-upload-list="false"
                        :on-progress="_uploadProgress"
                        :on-format-error="_uploadFormatErr"
                        :on-success="_uploadSuccess"
                        :on-error="_uploadFail"
                        :format="uploadOpt.format"
                        action="/oa/kq/add">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或者拖拽文件到这里上传(后缀为.xls的文件)</p>
                    </div>
                    <Spin size="large" fix v-if="spinShow">数据导入中...</Spin>
                </Upload>
                <div slot="footer"></div>
            </Modal>
            <Modal v-model="deleteModalFlag"
                   width="300"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>删除考勤</span>
                </p>
                <Form >
                    <FormItem label="考勤月份">
                        <DatePicker type="month"
                                    placeholder="筛选考勤月份"
                                    @on-change="_deleteMonthChange"
                                    :value="deleteMonth"></DatePicker>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="deleteLoading"
                            @click="_confirmDelete">
                        <span v-if="!deleteLoading">确认删除</span>
                        <span v-else>正在删除...</span>
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="deleteModalFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="exportModalFlag"
                   width="300"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>导出考勤</span>
                </p>
                <Form >
                    <FormItem label="导出类型">
                        <RadioGroup v-model="exportType">
                            <Radio label="month">月份</Radio>
                            <Radio label="year">年份</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem :label="exportType === 'month' ? '考勤月份' : '考勤年份'">
                        <DatePicker :type="exportType"
                                    placeholder="筛选考勤月份"
                                    @on-change="_exportMonthChange"
                                    :value="exportMonth"></DatePicker>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="exportLoading"
                            @click="_confirmExport">
                        <span v-if="!exportLoading">确认导出</span>
                        <span v-else>正在导出...</span>
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="exportModalFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="settingModalFlag"
                   width="1200"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{attendanceOpt.userName + ' ' + attendanceOpt.monthDate}} 考勤总汇</span>
                </p>
                <div class="">
                    <Table :columns="attendanceAllCol"
                           :loading="tableLoading2"
                           height="500"
                           :data="attendanceOpt.data"></Table>
                </div>
                <div slot="footer">
                    <Button type="primary" @click="_completeThisMonth">完成 {{attendanceOpt.userName}} 该月审核</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="settingModalFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="strangeModalFlag"
                   width="400"
                   :styles="{top: '160px', zIndex: 100}"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>异常设置</span>
                </p>
                <Form :model="strangeSettingForm" :label-width="80">
                    <FormItem label="异常类型">
                        <Select v-model="strangeSettingForm.type" clearable>
                            <Option value="事假">事假</Option>
                            <Option value="病假">病假</Option>
                            <Option value="婚假">婚假</Option>
                            <Option value="产假" >产假</Option>
                            <Option value="年假" >年假</Option>
                            <Option value="法假">法假</Option>
                            <Option value="出差">出差</Option>
                            <Option value="调休">调休</Option>
                            <Option value="休息">休息</Option>
                            <Option value="旷工">旷工</Option>
                            <Option value="正常">正常</Option>
                            <Option value="生日假">生日假</Option>
                            <Option value="未入职">未入职</Option>
                            <Option value="丧假">丧假</Option>
                            <Option value="与排班不一致">与排班不一致</Option>
                            <Option value="无薪假">无薪假</Option>
                            <Option value="带薪假">带薪假</Option>
                            <Option value="陪护假" >陪护假</Option>
                            <Option value="取消设置">取消设置</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="请假天数">
                        <Select v-model="strangeSettingForm.days" clearable>
                            <Option value="1">1天</Option>
                            <Option value="0.5">0.5天</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="异常描述">
                        <Input v-model="strangeSettingForm.desc" type="textarea"
                               :autosize="{minRows: 2,maxRows: 5}"
                               placeholder=""></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" @click="_confirmStrangeSetting">确认设置</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="strangeModalFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import debounce from 'lodash/debounce';
    import moment from 'moment';
    export default {
        name: 'attendanceManage',
        data () {
            return {
                tableLoading2: false,
                settingModalFlag: false,
                importModalFlag: false,
                exportModalFlag: false,
                deleteModalFlag: false,
                exportLoading: false,
                deleteLoading: false,
                strangeModalFlag: false,
                spinShow: false,
                postFormType: 'update',
                recordId: '',
                exportMonth: moment().format('YYYY-MM'),
                deleteMonth: moment().format('YYYY-MM'),
                exportType: 'month',
                strangeSettingForm: {
                    type: '',
                    days: '',
                    desc: '',
                    id: ''
                },
                uploadOpt: {
                    format: ['xls']
                },
                depProps: {
                    value: 'id',
                    label: 'name'
                },
                postSettingForm: {
                    states: '',
                    name: '',
                    number: '',
                    organizename: '',
                    username: ''
                },
                filterOpt: {
                    kqstates: {
                        value: '',
                        type: 'select'
                    },
                    userName: {
                        value: '',
                        type: 'input'
                    },
                    monthDate: {
                        value: '',
                        type: 'date'
                    },
                    organizeName: {
                        value: '',
                        type: 'input'
                    },
                    postName: {
                        value: '',
                        type: 'input'
                    }
                },
                attendanceDelData: [],
                chooseDataArr: [],
                postColumns: [
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
                        title: '岗位',
                        key: 'postname',
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
                        render: (h, params) => {
                            return h('span', moment(params.row['record_month']).format('YYYY-MM'));
                        }
                    },
                    {
                        title: '迟到',
                        key: 'late_times',
                        align: 'center',
                        width: 60

                    },
                    {
                        title: '早退',
                        key: 'leave_early',
                        align: 'center',
                        width: 60
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
                        title: '带薪休假(天)',
                        key: 'paid_leave_day',
                        align: 'center',
                        width: 110
                    },
                    {
                        title: '出勤(天)',
                        key: 'regular_day',
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
                        title: '无薪假(天)',
                        key: 'without_pay_day',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '状态',
                        key: 'states',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: params.row.status === '未审核' ? 'red' : 'green'
                                }
                            }, params.row.status);
                        }
                    },
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '考勤设置',
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
                                            click: function (e) {
                                                e.stopPropagation();
                                                vm._editorSetting(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                attendanceAllCol: [
                    {
                        title: '打卡记录',
                        key: 'kq_re',
                        width: 210,
                        render: (h, params) => {
                            if (params.row.kq_re) {
                                let flag = params.row.exception === null || +params.row.exception === 0;
                                return h('Tag', {
                                    props: {
                                        color: flag ? 'green' : 'red'
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
                        title: '工种',
                        key: 'truetype',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '迟到',
                        key: 'c_count',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            if (+params.row.exception !== 2) {
                                let vm = this;
                                return h('InputNumber', {
                                    props: {
                                        value: params.row['c_count'],
                                        size: 'small',
                                        min: 0,
                                        editable: true
                                    },
                                    on: {
                                        'on-change': debounce(function (val) {
                                            params.row['c_count'] = val;
                                            vm._setEveryStrangeNumber(val, 'late', params.row);
                                        }, 300)
                                    }
                                });
                            }
                        }
                    },
                    {
                        title: '早退',
                        key: 'z_count',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            if (+params.row.exception !== 2) {
                                let vm = this;
                                return h('InputNumber', {
                                    props: {
                                        value: params.row['z_count'],
                                        size: 'small',
                                        min: 0,
                                        editable: true
                                    },
                                    on: {
                                        'on-change': debounce(function (val) {
                                            params.row['z_count'] = val;
                                            vm._setEveryStrangeNumber(val, 'leave_early', params.row);
                                        }, 300)
                                    }
                                });
                            }
                        }
                    },
                    {
                        title: '漏打卡',
                        key: 'l_count',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            if (+params.row.exception !== 2) {
                                let vm = this;
                                return h('InputNumber', {
                                    props: {
                                        value: params.row['l_count'],
                                        size: 'small',
                                        min: 0,
                                        editable: true
                                    },
                                    on: {
                                        'on-change': debounce(function (val) {
                                            params.row['l_count'] = val;
                                            vm._setEveryStrangeNumber(val, 'forget', params.row);
                                        }, 300)
                                    }
                                });
                            }
                        }
                    },
                    {
                        title: '审核状态',
                        key: 'offdaytype',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '备注信息',
                        key: 'describeex',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            let flag = params.row.exception === null || +params.row.exception === 0;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '设置异常',
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
                                        style: {
                                            marginRight: '8px'
                                        },
                                        on: {
                                            click: function () {
                                                vm._setStrangeDay(params.row);
                                            }
                                        }
                                    })
                                ]),
                                flag ? ''
                                    : h('Tooltip', {
                                        props: {
                                            content: '审核通过',
                                            placement: 'top',
                                            transfer: true
                                        }
                                    }, [
                                        h('Button', {
                                            props: {
                                                type: 'success',
                                                icon: 'checkmark-round',
                                                shape: 'circle'
                                            },
                                            on: {
                                                click: function () {
                                                    vm._setConfirmPass(params.row);
                                                }
                                            }
                                        })
                                    ])
                            ]);
                        }
                    }
                ],
                tableHeight: 500,
                attendanceOpt: {
                    userName: '',
                    monthDate: '',
                    data: []
                }
            };
        },
        watch: {
            exportType(val) {
                if (val === 'month') this.exportMonth = moment().format('YYYY-MM');
                else this.exportMonth = moment().format('YYYY');
            }
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _delAttendanceInfo() {
                this.$Modal.confirm({
                    content: '确认删除所选的记录么？',
                    okText: '确认删除',
                    cancelText: '取消',
                    onOk: () => {
                        let data = {};
                        data.ids = this.chooseDataArr.map(x => x.id).join(',');
                        this.$http.post('/kq/deleteUserStatistic', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('删除成功!');
                                this._getPostData();
                                this.chooseDataArr = [];
                            }
                        });
                    }
                });
            },
            _confirmDelete() {
                this.deleteLoading = true;
                let data = {};
                data.date = this.deleteMonth;
                this.$http.post('/kq/delete', data).then((res) => {
                    if (res.success) {
                        this.$Message.success(this.deleteMonth + '考勤数据删除成功!');
                        this.deleteModalFlag = false;
                    }
                }).finally(() => {
                    this.deleteLoading = false;
                });
            },
            _exportMonthChange(date) {
                this.exportMonth = date;
            },
            _deleteMonthChange(date) {
                this.deleteMonth = date;
            },
            _confirmExport() {
                this.exportLoading = true;
                let data = {};
                data.date = this.exportMonth;
                let getUrl = this.exportType === 'month' ? '/kq/export' : '/kq/exportYear';
                this.$http.get(getUrl, {params: data}).then((res) => {
                    if (res.success) {
                        document.getElementById('hrefToExportTable').href = '/oa/download/' + res.data;
                        document.getElementById('hrefToExportTable').download = res.data;
                        document.getElementById('hrefToExportTable').click();
                        this.exportModalFlag = false;
                    }
                }).finally(() => {
                    this.exportLoading = false;
                });
            },
            _completeThisMonth() {
                let data = {};
                data.user_name = this.attendanceOpt.userName;
                data.record_month = this.attendanceOpt.monthDate;
                this.$http.post('/kq/completeExamine', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('操作成功!');
                        this._getPostData();
                        this.settingModalFlag = false;
                    }
                });
            },
            _initAttendanceOpt() {
                this.attendanceOpt.userName = '';
                this.attendanceOpt.monthDate = '';
                this.attendanceOpt.data = [];
            },
            _initStrangeSettingForm() {
                this.strangeSettingForm.type = '';
                this.strangeSettingForm.days = '';
                this.strangeSettingForm.desc = '';
                this.strangeSettingForm.id = '';
            },
            _setConfirmPass(data) {
                let sendData = {};
                sendData.id = data.id;
                this.$http.post('/kq/completeSingle', sendData).then((res) => {
                    if (res.success) {
                        this.$Message.success('审核通过成功!');
                        this._getUserStatistic();
                    }
                });
            },
            _confirmStrangeSetting() {
                let data = {};
                data.id = this.strangeSettingForm.id;
                data.type = this.strangeSettingForm.type;
                data.quality = this.strangeSettingForm.days;
                data.text = this.strangeSettingForm.desc;
                data.date = this.attendanceOpt.monthDate;
                this.$http.post('/kq/updateOffDayType', data).then((res) => {
                    if (res.success) {
                        this.strangeModalFlag = false;
                        this.$Message.success('异常设置成功!');
                        this._getUserStatistic();
                    }
                });
            },
            _setStrangeDay(data) {
                this._initStrangeSettingForm();
                this.strangeSettingForm.id = data.id;
                let sendData = {};
                sendData.id = data.id;
                this.$http.get('/kq/setException', {params: sendData}).then((res) => {
                    this.strangeSettingForm.type = res.exceptionType ? res.exceptionType : '';
                    this.strangeSettingForm.days = res.exceptionDay ? res.exceptionDay + '' : '';
                });
                this.strangeModalFlag = true;
            },
            _setEveryStrangeNumber(val, type, data) {
                let sendData = {};
                sendData.username = data.user_name;
                sendData.id = data.id;
                sendData.number = val;
                sendData.type = type;
                this.$http.post('/kq/updateStatistic', sendData).then((res) => {
                    if (res.success) {
                        this.$Message.success('操作成功!');
                        this._getUserStatistic();
                        this._getPostData();
                    }
                });
            },
            _uploadProgress(event) {
                this.spinShow = true;
            },
            _uploadSuccess(response, file, fileList) {
                if (response.success) {
                    this.$Message.success('数据导入成功!');
                    this.importModalFlag = false;
                    this._getPostData();
                } else {
                    this.$Message.error(response.message);
                }
                this.spinShow = false;
            },
            _uploadFail(error, file, fileList) {
            },
            _uploadFormatErr() {
                this.$Message.error('上传文件的后缀必须为.xls');
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _editorSetting(data) {
                this._initAttendanceOpt();
                this.attendanceOpt.userName = data.user_name;
                this.attendanceOpt.monthDate = moment(data.record_month).format('YYYY-MM');
                this._getUserStatistic();
                this.settingModalFlag = true;
            },
            _getUserStatistic() {
                this.tableLoading2 = true;
                let sendData = {};
                sendData.userName = this.attendanceOpt.userName;
                sendData.recordMonth = this.attendanceOpt.monthDate;
                this.$http.get('/kq/userStatistic', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.attendanceOpt.data = res.data;
                    }
                }).finally(() => {
                    this.tableLoading2 = false;
                });
            },
            _getPostData() {
                this.$refs.attendanceTable.getListData();
            }
        },
        components: {fsTablePage}
    };
</script>
