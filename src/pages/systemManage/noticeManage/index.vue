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
                    <DatePicker placeholder="筛选开始日期"
                                @on-change="_monthStartDateChange"
                                :value="filterOpt.startDate"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker placeholder="筛选结束日期"
                                @on-change="_monthEndDateChange"
                                :value="filterOpt.endDate"></DatePicker>
                </FormItem>
                <FormItem label="公告类型">
                    <Select v-model="filterOpt.type"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option value="0">制度</Option>
                        <Option value="1">任命</Option>
                        <Option value="2">通知</Option>
                        <Option value="3">考勤</Option>
                        <Option value="4">奖惩</Option>
                        <Option value="5">其他</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <ButtonGroup>
                        <Button type="ghost" @click="_openNewNotice">
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
                  :current="pageData.page"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :page-size="pageData.pageSize"
                  placement="top"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
            <Modal v-model="settingModalFlag"
                   width="1100"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>发布公告</span>
                </p>
                <Row :gutter="16">
                    <Col :span="16">
                        <Form :model="strangeSettingForm"
                              ref="noticeFormDom"
                              :rules="noticeRule"
                              :label-width="80">
                        <Row>
                            <Col :span="24">
                            <FormItem label="标题" prop="title">
                                <Input type="text"
                                       v-model="strangeSettingForm.title"
                                       placeholder="公告标题"></Input>
                            </FormItem>
                            </Col>
                            <Col :span="8">
                            <FormItem label="公告类型">
                                <Select v-model="strangeSettingForm.type">
                                    <Option value="0">制度</Option>
                                    <Option value="1">任命</Option>
                                    <Option value="2">通知</Option>
                                    <Option value="3" >考勤</Option>
                                    <Option value="4" >奖惩</Option>
                                    <Option value="5" >其他</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col :span="8">
                            <FormItem label="阅读要求">
                                <Select v-model="strangeSettingForm.require">
                                    <Option value="0">不强制</Option>
                                    <Option value="1">强制阅读</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <!--<Col :span="8">-->
                            <!--<FormItem label="发布状态">-->
                                <!--<Select v-model="strangeSettingForm.status">-->
                                    <!--<Option value="0">草稿</Option>-->
                                    <!--<Option value="1">发布</Option>-->
                                <!--</Select>-->
                            <!--</FormItem>-->
                            <!--</Col>-->
                        </Row>
                            <wang-editor
                                    v-if="settingModalFlag"
                                    :menus="editorMeun"
                                    :editorcontent.sync="editorContent"
                                    :defaul-text="'公告内容...'"
                                    img-url="/oa/share/uploadFile"></wang-editor>
                    </Form>
                    </Col>
                    <Col :span="8">
                        <h3>发布范围</h3>
                        <div style="max-height: 490px;overflow:auto;">
                            <el-tree :data="orgTreeData"
                                     ref="treeDom"
                                     show-checkbox
                                     :expand-on-click-node="false"
                                     :default-checked-keys="strangeSettingForm.deps"
                                     :highlight-current="true"
                                     node-key="id"
                                     style="margin-top: 10px;"
                                     :props="defaultProps"></el-tree>

                        </div>
                    </Col>
                </Row>
                <div slot="footer">
                    <Button type="primary"
                            v-show="isNoticeType === 'create'"
                            :loading="btnLoading"
                            @click="_operateNotice">
                        <span v-if="!btnLoading">立即发布</span>
                        <span v-else>发布中...</span>
                    </Button>
                    <!--<Button type="primary"-->
                            <!--v-show="strangeSettingForm.status === '0' && isNoticeType === 'create'"-->
                            <!--:loading="btnLoading"-->
                            <!--@click="_saveNotice">-->
                        <!--<span v-if="!btnLoading">存为草稿</span>-->
                        <!--<span v-else>保存中...</span>-->
                    <!--</Button>-->
                    <Button type="primary"
                            v-show="isNoticeType === 'update'"
                            :loading="btnLoading"
                            @click="_updateNotice">
                        <span v-if="!btnLoading">修改公告</span>
                        <span v-else>修改中...</span>
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="settingModalFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="lookModelFlag" width="740" :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{noticeData.title}}</span>
                </p>
                <div style="margin: 0 auto;max-height: 500px;width: 690px;overflow: auto;font-size: 16px;" v-html="noticeData.content"></div>
                <div slot="footer">
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import moment from 'moment';
    import debounce from 'lodash/debounce';
    import WangEditor from '@/baseComponents/fs-wangeditor';
    export default {
        name: 'noticeManage',
        data () {
            return {
                btnLoading: false,
                settingModalFlag: false,
                strangeModalFlag: false,
                lookModelFlag: false,
                isNoticeType: 'create',
                editorContent: '',
                editorMeun: [
                    'bold',
                    'italic',
                    'link',
                    'list',
                    'justify',
                    'emoticon',
                    'quote',
                    'image',
                    'video',
                    'undo',
                    'redo'
                ],
                noticeRule: {
                    title: [
                        { required: true, message: '标题不能为空!', trigger: 'blur' }
                    ]
                },
                noticeData: {
                    title: '',
                    content: ''
                },
                editorOpt: {
                    menubar: 'view',
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
                    type: '2',
                    require: '1',
                    status: '1',
                    id: '',
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
                        key: 'title'
                    },
                    {
                        title: '公告类型',
                        key: 'type',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            let typeContent = '';
                            switch (+params.row.noticetype) {
                                case 0:
                                    typeContent = '制度';
                                    break;
                                case 1:
                                    typeContent = '任命';
                                    break;
                                case 2:
                                    typeContent = '通知';
                                    break;
                                case 3:
                                    typeContent = '考勤';
                                    break;
                                case 4:
                                    typeContent = '奖惩';
                                    break;
                                default:
                                    typeContent = '其他';
                            }
                            return h('span', typeContent);
                        }
                    },
                    {
                        title: '发布日期',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('span', moment(params.row.nottime).format('YYYY-MM-DD'));
                        }
                    },
                    {
                        title: '发布人',
                        key: 'operater',
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
                                        style: {
                                            marginRight: '8px'
                                        },
                                        on: {
                                            click: function () {
                                                vm._editorSetting(params.row);
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
                                                vm._lookNotice(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                orgTreeData: [],
                allTreeId: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
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
            this._getOrgTree().then((res) => {
                this._getAllDepIds(res);
            });
        },
        methods: {
            _noticeHandler(id, desc) {
                this.$refs.noticeFormDom.validate((valid) => {
                    if (valid) {
                        this.btnLoading = true;
                        let data = {};
                        data.title = this.strangeSettingForm.title;
                        data.content = this.editorContent;
                        data.organizeId = this.$refs.treeDom.getCheckedKeys().join(',');
                        data.noticeType = this.strangeSettingForm.type;
                        data.state = this.strangeSettingForm.status;
                        data.type = this.strangeSettingForm.require;
                        data.id = id;
                        this.$http.post('/notice/add', data).then((res) => {
                            if (res.success) {
                                this.$Message.success(desc);
                                this.settingModalFlag = false;
                                this._getPostData();
                            }
                        }).finally(() => {
                            this.btnLoading = false;
                        });
                    }
                });
            },
            _updateNotice() {
                this._noticeHandler(this.strangeSettingForm.id, '修改公告成功!');
            },
            _operateNotice() {
                this._noticeHandler(0, '发布公告成功!');
            },
            _getAllDepIds(data) {
                data.forEach((item) => {
                    this.allTreeId.push(item.id);
                    if (item.children) this._getAllDepIds(item.children);
                });
            },
            _initNoticeForm() {
                this.$refs.noticeFormDom.resetFields();
                this.strangeSettingForm.title = '';
                this.strangeSettingForm.type = '2';
                this.strangeSettingForm.require = '1';
                this.strangeSettingForm.status = '1';
                this.strangeSettingForm.id = '';
                this.editorContent = '';
                this.$refs.treeDom.setCheckedKeys(this.allTreeId.slice(0));
            },
            _openNewNotice() {
                this._initNoticeForm();
                this.isNoticeType = 'create';
                this.settingModalFlag = true;
            },
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
                this.isNoticeType = 'update';
                this._initNoticeForm();
                this.strangeSettingForm.title = data.title;
                this.strangeSettingForm.type = data.noticetype;
                this.strangeSettingForm.require = data.type;
                this.strangeSettingForm.status = data.state + '';
                this.strangeSettingForm.content = data.content;
                this.editorContent = data.content;
                this.strangeSettingForm.id = data.id;
                this.$refs.treeDom.setCheckedKeys(data.organzeid ? data.organzeid.split(',').filter(x => !!x) : []);
                this.settingModalFlag = true;
            },
            _lookNotice(data) {
                this.lookModelFlag = true;
                this.noticeData.title = data.title;
                this.noticeData.content = data.content;
            },
            _getOrgTree() {
                return new Promise((resolve) => {
                    this.$http.get('/organize/organizeTreeCertainVmC?fatherId=-1').then((res) => {
                        if (res.success) {
                            this.orgTreeData = res.data;
                            resolve(res.data);
                        }
                    });
                });
            },
            _getPostData() {
                let data = {};
                data.title = this.filterOpt.title;
                data.noticeType = this.filterOpt.type;
                data.startDate = this.filterOpt.startDate;
                data.endDate = this.filterOpt.endDate;
                this.getList('/notice/datalist', data);
            }
        },
        components: {
            WangEditor
        }
    };
</script>

