<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="姓名">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.userName"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="考勤月份">
                    <DatePicker type="month"
                                placeholder="筛选考勤月份"
                                @on-change="_monthDateChange"
                                :value="filterOpt.monthDate"></DatePicker>
                </FormItem>
                <FormItem label="部门">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.organizeName"
                           placeholder="筛选部门"></Input>
                </FormItem>
                <FormItem label="岗位">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.postName"
                           placeholder="筛选岗位"></Input>
                </FormItem>
                <FormItem label="审核状态">
                    <Select v-model="filterOpt.kqstates"
                            clearable
                            @on-change="_filterResultHandler"
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
                        <Button type="ghost">
                            <Icon type="ios-cloud-download-outline"></Icon>
                            导出
                        </Button>
                        <!--<Button type="ghost" @click="_exportCsv">-->
                            <!--<Icon type="ios-cloud-download-outline"></Icon>-->
                            <!--导出CSV-->
                        <!--</Button>-->
                    </ButtonGroup>
                </FormItem>
            </Form>
            <Table :columns="postColumns"
                   :loading="tableLoading"
                   :height="tableHeight"
                   ref="attendanceTable"
                   :data="pageData.list"></Table>
            <Page :total="pageData.totalCount"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :page-size="pageData.pageSize"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
            <Modal v-model="importModalFlag"
                   width="400"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>导入考勤表</span>
                </p>
                <Upload
                        type="drag"
                        :on-format-error="_uploadFormatErr"
                        :on-success="_uploadSuccess"
                        :on-error="_uploadFail"
                        :format="uploadOpt.format"
                        action="//jsonplaceholder.typicode.com/posts/">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或者拖拽文件到这里上传(后缀为.xls的文件)</p>
                    </div>
                </Upload>
                <div slot="footer"></div>
            </Modal>
            <Modal v-model="settingModalFlag"
                   width="1000"
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
                    <Button type="primary">完成 {{attendanceOpt.userName}} 该月审核</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="settingModalFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import moment from 'moment';
    import debounce from 'lodash/debounce';
    export default {
        name: 'attendanceManage',
        data () {
            return {
                tableLoading2: false,
                settingModalFlag: false,
                importModalFlag: false,
                postFormType: 'update',
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
                    kqstates: '',
                    userName: '',
                    monthDate: '',
                    organizeName: '',
                    postName: ''
                },
                attendanceDelData: [],
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
                            return h('span', moment(params.row['record_month']).format('YYYY-MM'))
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
                                            click: function () {
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
                        width: '240',
                        fixed: 'left',
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
                        title: '工种',
                        key: 'truetype',
                        align: 'center'
                    },
                    {
                        title: '迟到',
                        key: 'c_count',
                        align: 'center',
                        render: (h, params) => {
                            return h()
                        }
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
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '备注信息',
                        key: 'level',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '操作',
                        fixed: 'right',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
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
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
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
        mixins: [pageMixin],
        created() {
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
            _exportCsv() {
                this.$refs.attendanceTable.exportCsv({
                    filename: 'The original data'
                });
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
            _uploadSuccess(response, file, fileList) {
                console.log(response)
            },
            _uploadFail(error, file, fileList) {
                console.log(error)
            },
            _uploadFormatErr() {
                this.$Message.error('上传文件的后缀必须为.xls');
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _monthDateChange(val) {
                this.filterOpt.monthDate = val;
                this._filterResultHandler();
            },
            _setPage(page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize(size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
            _editorSetting(data) {
                this.tableLoading2 = true;
                this.attendanceOpt.userName = data.user_name;
                this.attendanceOpt.monthDate = moment(data.record_month).format('YYYY-MM');
                this.settingModalFlag = true;
                let sendData = {};
                sendData.userName = this.attendanceOpt.userName;
                sendData.recordMonth = this.attendanceOpt.monthDate;
                this.$http.get('/kq/userStatistic', {params: sendData}).then((res) => {
                    if (res.success) {
                        this.attendanceOpt.data = res.data;
                    }
                    console.log(res);
                }).finally(() => {
                    this.tableLoading2 = false;
                });
                console.log(data);
            },
            _getPostData() {
                let data = {};
                data.userName = this.filterOpt.userName;
                data.monthDate = this.filterOpt.monthDate;
                data.kqstates = this.filterOpt.kqstates;
                data.organizeName = this.filterOpt.organizeName;
                data.postName = this.filterOpt.postName;
                this.getList('/kq/getStatisticList', data);
            }
        },
        components: {}
    };
</script>
