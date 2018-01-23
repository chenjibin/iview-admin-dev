<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="姓名">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="部门">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.level"
                           placeholder="筛选部门"></Input>
                </FormItem>
                <FormItem label="岗位">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.organizeName"
                           placeholder="筛选岗位"></Input>
                </FormItem>
                <FormItem label="审核状态">
                    <Select v-model="filterOpt.states"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option value="1">审核完毕</Option>
                        <Option value="0">未审核</Option>
                    </Select>
                </FormItem>
                <FormItem label="考勤月份">
                    <DatePicker type="month"
                                placeholder="筛选考勤月份"
                                :value="filterOpt.date"></DatePicker>
                </FormItem>
                <FormItem>
                    <ButtonGroup>
                        <Button type="ghost">
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
            <Modal v-model="settingModalFlag"
                   width="1000"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>XXX 2017-01 考勤总汇</span>
                </p>
                <div class="">
                    <Table :columns="attendanceAllCol"
                           :loading="tableLoading2"
                           height="500"
                           :data="pageData.list"></Table>
                </div>
                <div slot="footer">
                    <Button type="primary">完成 XX 该月审核</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="settingModalFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    export default {
        name: 'attendanceManage',
        data () {
            return {
                tableLoading2: false,
                settingModalFlag: false,
                postFormType: 'update',
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
                    name: '',
                    level: '',
                    states: '1',
                    organizeName: '',
                    date: ''
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
                        key: 'number',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '岗位',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '员工姓名',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '记录月份',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '迟到',
                        key: 'level',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '早退',
                        key: 'level',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '漏打卡',
                        key: 'level',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '请假(天)',
                        key: 'level',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '带薪休假(天)',
                        key: 'level',
                        align: 'center',
                        width: 110
                    },
                    {
                        title: '出勤(天)',
                        key: 'level',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '旷工(天)',
                        key: 'level',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '无薪假(天)',
                        key: 'level',
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
                                    color: +params.row.states === 1 ? 'green' : 'red'
                                }
                            }, +params.row.states === 1 ? '审核完毕' : '未审核');
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
                        key: 'level',
                        align: 'center',
                        width: '110'
                    },
                    {
                        title: '迟到',
                        key: 'level',
                        align: 'center'
                    },
                    {
                        title: '早退',
                        key: 'level',
                        align: 'center'
                    },
                    {
                        title: '漏打卡',
                        key: 'level',
                        align: 'center'
                    },
                    {
                        title: '审核状态',
                        key: 'level',
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
                tableHeight: 500
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
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
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
                this.settingModalFlag = true;
                console.log(data);
            },
            _getPostData() {
                let data = {};
                data.name = this.filterOpt.name;
                data.level = this.filterOpt.level;
                data.states = this.filterOpt.states;
                data.organizeName = this.filterOpt.organizeName;
                this.getList('/post/datalist', data);
            }
        },
        components: {}
    };
</script>
