<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="试卷名称">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选试卷"></Input>
                </FormItem>
                <FormItem label="试卷分类">
                    <Select v-model="filterOpt.subjectPaper.value"
                            style="width: 200px"
                            clearable>
                        <Option :value="item.id" v-for="item, index in subjectList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="试卷状态">
                    <Select v-model="filterOpt.status.value"
                            clearable
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option :value="item.status" v-for="item, index in statusList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" @click="_addPaperOpen">
                            <Icon type="plus-round"></Icon>
                            添加试卷
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           ref="paperList"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/exampaper/getPaperList"></fs-table-page>
            <Modal v-model="editorSettingFlag"
                   width="500"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>添加试卷</span>
                </p>
                <Form :label-width="80"
                      :model="editorSettingData"
                      ref="paperForm"
                      :rules="paperRules">
                    <FormItem label="试卷名称" prop="name">
                        <Input type="text"
                               v-model="editorSettingData.name"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem label="试卷分类">
                        <Select v-model="editorSettingData.subjectPaper">
                            <Option :value="item.id" v-for="item, index in subjectList" :key="index">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="是否随机">
                        <RadioGroup v-model="editorSettingData.isRandom">
                            <Radio :label="1">正常</Radio>
                            <Radio :label="2">随机</Radio>
                        </RadioGroup>
                    </FormItem>
                    <div class="" v-show="editorSettingData.isRandom === 2">
                        <FormItem label="试题分类">
                            <Select v-model="editorSettingData.subject">
                                <Option :value="item.id" v-for="item, index in subjectList" :key="index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="单选题">
                            <InputNumber :min="0" v-model="editorSettingData.singleTypeNum"></InputNumber>
                        </FormItem>
                        <FormItem label="多选题">
                            <InputNumber :min="0" v-model="editorSettingData.multiTypeNum"></InputNumber>
                        </FormItem>
                        <FormItem label="判断题">
                            <InputNumber :min="0" v-model="editorSettingData.trueOrFalseTypeNum"></InputNumber>
                        </FormItem>
                        <FormItem label="填空题">
                            <InputNumber :min="0" v-model="editorSettingData.fillTypeNum"></InputNumber>
                        </FormItem>
                        <FormItem label="问答题">
                            <InputNumber :min="0" v-model="editorSettingData.questionTypeNum"></InputNumber>
                        </FormItem>
                    </div>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="_submitPaper">
                        添加试卷
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="paperSettingFlag"
                   width="1500"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>为试卷挑选试题</span>
                </p>
                <div class="">
                    <Row :gutter="16">
                        <Col :span="12">
                            <paper-question-list :id="paperId"
                                                 ref="questionList"
                                                 @add-success="_getPaperDetail"></paper-question-list>
                        </Col>
                        <Col :span="12">
                            <editor-paper :id="paperId"
                                          :editorabled="true"
                                          @del-question-success="_updateQuestionList"
                                          ref="paperDetail"></editor-paper>
                        </Col>
                    </Row>
                </div>
                <div slot="footer">
                    <Button type="ghost" style="margin-left: 8px" @click="paperSettingFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="paperCheckFlag"
                   width="1200"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>查看试卷</span>
                </p>
                <div class="">
                    <editor-paper :id="paperIdCheck"></editor-paper>
                </div>
                <div slot="footer">
                    <Button type="ghost" style="margin-left: 8px" @click="paperCheckFlag = false">关闭</Button>
                </div>
            </Modal>
            <Modal v-model="paperNameflag"
                   width="800"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>修改试卷</span>
                </p>
                <div class="">
                    <Form :label-width="80"
                          :model="paperNameForm"
                          ref="paperNameForm"
                          :rules="paperNameRules">
                        <FormItem label="试卷名称" prop="name">
                            <Input type="text"
                                   v-model="paperNameForm.name"></Input>
                        </FormItem>
                        <FormItem label="试卷分类">
                            <Select v-model="paperNameForm.subjectPaper">
                                <Option :value="item.id" v-for="item, index in subjectList" :key="index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="primary" style="margin-left: 8px" @click="_confirmSubmitPaperName">提交修改</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="paperNameflag = false">关闭</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import paperQuestionList from '../components/paper-question-list';
    import editorPaper from '../components/editor-paper';
    export default {
        name: 'paperManage',
        data () {
            const colBtn = (vm, h, params, {content, icon, foo}) => {
                return h('Tooltip', {
                    props: {
                        content: content,
                        placement: 'top',
                        transfer: true
                    }
                }, [
                    h('Button', {
                        props: {
                            type: 'primary',
                            icon: icon,
                            shape: 'circle'
                        },
                        style: {
                            margin: '0 2px'
                        },
                        on: {
                            click: function () {
                                foo(params.row);
                            }
                        }
                    })
                ]);
            };
            return {
                editorSettingFlag: false,
                btnLoading: false,
                paperSettingFlag: false,
                paperCheckFlag: false,
                paperNameflag: false,
                paperId: 0,
                paperIdCheck: 0,
                postFormType: 'update',
                paperRules: {
                    name: [
                        {required: true, message: '试卷名称不能为空!', trigger: 'blur'}
                    ]
                },
                statusList: [
                    {
                        status: 1,
                        name: '待发布'
                    },
                    {
                        status: 2,
                        name: '已发布'
                    },
                    {
                        status: 3,
                        name: '已关闭'
                    }
                ],
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    status: {
                        value: '',
                        type: 'select'
                    },
                    subjectPaper: {
                        value: '',
                        type: 'select'
                    }
                },
                editorSettingData: {
                    name: '',
                    isRandom: 2,
                    subject: 1,
                    subjectPaper: 1,
                    singleTypeNum: 0,
                    multiTypeNum: 0,
                    trueOrFalseTypeNum: 0,
                    fillTypeNum: 0,
                    questionTypeNum: 0
                },
                paperNameForm: {
                    name: '',
                    subjectPaper: '',
                    id: 0
                },
                paperNameRules: {
                    name: [
                        {required: true, message: '试卷名称不能为空!', trigger: 'blur'}
                    ]
                },
                postColumns: [
                    {
                        title: '试卷名称',
                        key: 'name'
                    },
                    {
                        title: '试卷类型',
                        key: 'subject',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            let resultList = this.subjectList.filter(x => x.id === params.row.subject);
                            if (resultList.length) {
                                return h('span', resultList[0].name || '');
                            } else {
                                return h('span', params.row.subject);
                            }
                        }
                    },
                    {
                        title: '总分',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return h('span', params.row.totlemark || 0);
                        }
                    },
                    {
                        title: '状态',
                        key: 'user_name',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let status = params.row.status;
                            let color = '';
                            let content = '';
                            if (status === 1) {
                                color = 'red';
                                content = '待发布';
                            } else if (status === 2) {
                                color = 'green';
                                content = '已发布';
                            } else {
                                color = 'default';
                                content = '已关闭';
                            }
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color
                                }
                            }, content);
                        }
                    },
                    {
                        title: '创建人',
                        key: 'createbyname',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '创建时间',
                        key: 'createbydate',
                        align: 'center',
                        width: 240
                    },
                    {
                        title: '操作',
                        key: 'user_name',
                        align: 'center',
                        width: 300,
                        render: (h, params) => {
                            let vm = this;
                            let status = params.row.status;
                            if (status === 1) {
                                return h('div', [
                                    colBtn(vm, h, params, {content: '添加试题', icon: 'plus-round', foo: vm._addQuestion}),
                                    colBtn(vm, h, params, {content: '修改试卷', icon: 'compose', foo: vm._changePaperName}),
                                    colBtn(vm, h, params, {content: '发布试卷', icon: 'play', foo: vm._publishPaper})
                                ]);
                            } else if (status === 2) {
                                return h('div', [
                                    colBtn(vm, h, params, {content: '查看试卷', icon: 'eye', foo: vm._checkPaper}),
                                    colBtn(vm, h, params, {content: '关闭试卷', icon: 'close-round', foo: vm._closePaper}),
                                    colBtn(vm, h, params, {content: '复制试卷', icon: 'ios-copy-outline', foo: vm._copyPaper})
                                ]);
                            } else if (status === 3) {
                                return h('div', [
                                    colBtn(vm, h, params, {content: '重新发布', icon: 'checkmark-round', foo: vm._republishPaper})
                                ]);
                            }
                        }
                    }
                ],
                tableHeight: 500,
                subjectList: []
            };
        },
        created() {
            this._setTableHeight();
            this._getSubjectList();
        },
        watch: {
            subjectList(val) {
                if (val.length) {
                    this.editorSettingData.subject = val[0].id;
                }
            }
        },
        methods: {
            _updateQuestionList() {
                this.$refs.questionList._updateList();
                this._updatePaperList();
            },
            _getPaperDetail() {
                this.$refs.paperDetail._getPaperDetail();
                this._updatePaperList();
            },
            _addQuestion(data) {
                this.paperId = data.id;
                this.paperSettingFlag = true;
            },
            _changePaperName(data) {
                this.paperNameForm.name = data.name;
                this.paperNameForm.subjectPaper = data.subject;
                this.paperNameForm.id = data.id;
                this.paperNameflag = true;
            },
            _confirmSubmitPaperName() {
                let data = {};
                data.name = this.paperNameForm.name;
                data.subjectPaper = this.paperNameForm.subjectPaper;
                data.id = this.paperNameForm.id;
                this.$http.post('/exampaper/add', data).then((res) => {
                    if (res.success) {
                        this.paperNameflag = false;
                        this.$Message.success('试卷名称修改成功!');
                        this._updatePaperList();
                    }
                });
            },
            _publishPaper(data) {
                this.$Modal.confirm({
                    content: `确认发布【${data.name}】试卷么？`,
                    okText: '确认发布',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 2;
                        this.$http.post('/exampaper/editPaperStatus', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('试卷发布成功!');
                                this._updatePaperList();
                            }
                        });
                    }
                });
            },
            _checkPaper(data) {
                this.paperIdCheck = data.id;
                this.paperCheckFlag = true;
            },
            _closePaper(data) {
                this.$Modal.confirm({
                    content: `确认关闭【${data.name}】试卷么？`,
                    okText: '确认关闭',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 3;
                        this.$http.post('/exampaper/editPaperStatus', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('关闭试卷成功!');
                                this._updatePaperList();
                            }
                        });
                    }
                });
            },
            _copyPaper(data) {
                this.$Modal.confirm({
                    content: `确认复制【${data.name}】试卷么？复制试卷进入待发布状态！！！`,
                    okText: '确认复制',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 2;
                        this.$http.post('/exampaper/copyPaper', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('试卷复制成功!');
                                this._updatePaperList();
                            }
                        });
                    }
                });
            },
            _republishPaper(data) {
                this.$Modal.confirm({
                    content: `确认重新发布【${data.name}】试卷么？`,
                    okText: '确认发布',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 2;
                        this.$http.post('/exampaper/editPaperStatus', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('重新发布试卷成功!');
                                this._updatePaperList();
                            }
                        });
                    }
                });
            },
            _updatePaperList() {
                this.$refs.paperList.getListData();
            },
            _initEditorSettingData() {
                this.$refs.paperForm.resetFields();
                let editorSetting = this.editorSettingData;
                editorSetting.name = '';
                editorSetting.isRandom = 2;
                editorSetting.subject = this.subjectList[0].id;
                editorSetting.subjectPaper = this.subjectList[0].id;
                editorSetting.singleTypeNum = 0;
                editorSetting.multiTypeNum = 0;
                editorSetting.trueOrFalseTypeNum = 0;
                editorSetting.fillTypeNum = 0;
                editorSetting.questionTypeNum = 0;
            },
            _addPaperOpen() {
                this._initEditorSettingData();
                this.editorSettingFlag = true;
            },
            _submitPaper() {
                this.$refs.paperForm.validate((valid) => {
                    if (valid) {
                        let editorSetting = this.editorSettingData;
                        if (editorSetting.isRandom === 1) {
                            let sendData = {};
                            sendData.id = 0;
                            sendData.subjectPaper = editorSetting.subjectPaper;
                            sendData.name = editorSetting.name;
                            this.$http.post('/exampaper/add', sendData).then((res) => {
                                if (res.success) {
                                    this.editorSettingFlag = false;
                                    this.$Message.success('试卷添加成功!');
                                    this._updatePaperList();
                                }
                            });
                        } else {
                            let sendData = {};
                            sendData.name = editorSetting.name;
                            sendData.subjectPaper = editorSetting.subjectPaper;
                            sendData.subject = editorSetting.subject;
                            sendData.count1 = editorSetting.singleTypeNum;
                            sendData.count2 = editorSetting.multiTypeNum;
                            sendData.count3 = editorSetting.trueOrFalseTypeNum;
                            sendData.count4 = editorSetting.fillTypeNum;
                            sendData.count5 = editorSetting.questionTypeNum;
                            this.$http.post('/exampaper/addRandomPaper', sendData).then((res) => {
                                if (res.success) {
                                    this.editorSettingFlag = false;
                                    this.$Message.success('试卷添加成功!');
                                    this._updatePaperList();
                                }
                            });
                        }
                    }
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _getSubjectList() {
                this.$http.get('/examquestion/getSubjectList').then((res) => {
                    if (res.success) {
                        this.subjectList = res.data;
                        this._updatePaperList();
                    }
                });
            }
        },
        components: {
            fsTablePage,
            paperQuestionList,
            editorPaper
        }
    };
</script>
