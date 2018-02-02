<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="标题">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.title"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker type="month"
                                placeholder="筛选考勤月份"
                                @on-change="_monthStartDateChange"
                                :value="filterOpt.startDate"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker type="month"
                                placeholder="筛选考勤月份"
                                @on-change="_monthEndDateChange"
                                :value="filterOpt.endDate"></DatePicker>
                </FormItem>
                <FormItem label="公告类型">
                    <Select v-model="filterOpt.type"
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
                        <Button type="ghost" @click="strangeModalFlag = true">
                            <Icon type="paper-airplane"></Icon>
                            发布公告
                        </Button>
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
                  placement="top"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
            <Modal v-model="strangeModalFlag"
                   width="800"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>发布公告</span>
                </p>
                <Form :model="strangeSettingForm" :label-width="80">
                    <Row>
                        <Col :span="24">
                            <FormItem label="标题">
                                <Input type="text"
                                       v-model="strangeSettingForm.title"
                                       placeholder="公告标题"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="公告类型">
                                <Select v-model="strangeSettingForm.type" clearable>
                                    <Option value="事假">事假</Option>
                                    <Option value="病假">病假</Option>
                                    <Option value="婚假">婚假</Option>
                                    <Option value="产假" >产假</Option>
                                    <Option value="年假" >年假</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="阅读要求">
                                <Select v-model="strangeSettingForm.require" clearable>
                                    <Option value="1">1天</Option>
                                    <Option value="0.5">0.5天</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="发布状态">
                                <Select v-model="strangeSettingForm.status" clearable>
                                    <Option value="1">1天</Option>
                                    <Option value="0.5">0.5天</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <text-editor
                            :menubar="editorOpt.menubar"
                            :plugins="editorOpt.plugins"
                            :editor-content="strangeSettingForm.content"
                            :toolbar1="editorOpt.toolbar1"
                            @content-change="_setContent"></text-editor>
                </Form>
                <div slot="footer">
                    <Button type="primary">发布</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="strangeModalFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import moment from 'moment';
    import debounce from 'lodash/debounce';
    import textEditor from '@/baseComponents/text-editor';
    export default {
        name: 'noticeManage',
        data () {
            return {
                settingModalFlag: false,
                strangeModalFlag: false,
                editorOpt: {
                    menubar: '',
                    plugins: [
                        'advlist autolink lists charmap print preview hr anchor pagebreak imagetools',
                        'searchreplace visualblocks visualchars code fullpage',
                        'insertdatetime media nonbreaking save table contextmenu directionality',
                        'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                    ],
                    toolbar1: 'preview | undo redo | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent'
                },
                strangeSettingForm: {
                    title: '',
                    type: '',
                    require: '',
                    status: '',
                    content: '',
                    editorContent: ''
                },
                depProps: {
                    value: 'id',
                    label: 'name'
                },
                filterOpt: {
                    title: '',
                    type: '',
                    startDate: '',
                    endDate: ''
                },
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '标题',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '公告类型',
                        key: 'late_times',
                        align: 'center',
                        width: 100

                    },
                    {
                        title: '发布日期',
                        key: 'leave_early',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '发布人',
                        key: 'forget_times',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '操作',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '修改',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'compose',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '预览',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'ios-eye',
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
            _setContent(content) {
                this.strangeSettingForm.editorContent = content;
            },
            _monthStartDateChange(date) {
                this.filterOpt.startDate = date;
            },
            _monthEndDateChange(date) {
                this.filterOpt.endDate = date;
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
                this._initAttendanceOpt();
                this.attendanceOpt.userName = data.user_name;
                this.attendanceOpt.monthDate = moment(data.record_month).format('YYYY-MM');
                this._getUserStatistic();
                this.settingModalFlag = true;
            },
            _getPostData() {
                let data = {};
                data.userName = this.filterOpt.userName;
                data.monthDate = this.filterOpt.monthDate;
                data.kqstates = this.filterOpt.kqstates;
                data.organizeName = this.filterOpt.organizeName;
                data.postName = this.filterOpt.postName;
                // this.getList('/kq/getStatisticList', data);
            }
        },
        components: {
            textEditor
        }
    };
</script>

