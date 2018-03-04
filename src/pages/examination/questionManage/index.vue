<template>
    <div>
        <Card>
            <Form inline :label-width="60"  @submit.native.prevent>
                <FormItem label="试题名称">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选试题名称"></Input>
                </FormItem>
                <FormItem label="试题分类">
                    <Select v-model="filterOpt.subject.value"
                            clearable
                            placeholder="筛选分类"
                            style="width: 100px">
                        <Option :value="item.id" v-for="item, index in subjectList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="试题类型">
                    <Select v-model="filterOpt.type.value"
                            clearable
                            placeholder="筛选类型"
                            style="width: 100px">
                        <Option :value="item.value" v-for="item, index in typeOptMap" :key="index">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="ghost" @click="editorSettingFlag = true">
                            <Icon type="plus-round"></Icon>
                            添加试题
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/examquestion/getQuestionList"></fs-table-page>
            <Modal v-model="editorSettingFlag"
                   width="800"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>添加试题</span>
                </p>
                <Form :label-width="60">
                    <FormItem label="试题名称">
                        <Input type="textarea"
                               :autosize="{minRows: 2,maxRows: 4}"
                               v-model="editorSettingData.name"
                               placeholder=""></Input>
                    </FormItem>
                    <Row>
                        <Col :span="8">
                            <FormItem label="试题分类">
                                <Select v-model="editorSettingData.subject"
                                        placeholder=""
                                        style="width: 100px">
                                    <Option :value="item.id" v-for="item, index in subjectList" :key="index">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="试题类型">
                                <Select v-model="editorSettingData.type"
                                        placeholder=""
                                        style="width: 100px">
                                    <Option :value="item.value" v-for="item, index in typeOptMap" :key="index">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="试题分数">
                                <InputNumber :min="0" v-model="editorSettingData.mark"></InputNumber>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="答案选项">
                        <Table :columns="answerColumns"
                               :context="self"
                               :data="editorSettingData.questionList"></Table>
                        <div class="" style="margin-top: 8px;text-align: right">
                            <Button type="ghost"
                                    shape="circle"
                                    @click="_addNewAnswer"
                                    icon="plus-round">新增选项</Button>
                        </div>
                    </FormItem>
                    <FormItem label="试题答案">
                        <RadioGroup v-model="editorSettingData.singleType">
                            <Radio :label="index | indexToBigCode"
                                   v-for="item, index in editorSettingData.questionList"
                                   :key="index">{{index | indexToBigCode}}</Radio>
                        </RadioGroup>
                        <CheckboxGroup v-model="editorSettingData.multiType">
                            <Checkbox :label="index | indexToBigCode"
                                      v-for="item, index in editorSettingData.questionList"
                                      :key="index"></Checkbox>
                        </CheckboxGroup>
                        <Input type="text"
                               v-model="editorSettingData.answer"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem label="试题解析">
                        <Input type="textarea"
                               :autosize="{minRows: 2,maxRows: 4}"
                               v-model="editorSettingData.desc"
                               placeholder=""></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="">
                        添加商品
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsImgUpload from '@/baseComponents/fs-img-upload-new';
    export default {
        name: 'questionManage',
        data () {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                self: this,
                postFormType: 'update',
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    subject: {
                        value: '',
                        type: 'select'
                    },
                    type: {
                        value: '',
                        type: 'select'
                    }
                },
                answerColumns: [
                    {
                        title: '序号',
                        key: 'order',
                        align: 'center',
                        width: 60,
                        render: (h, params) => {
                            return String.fromCharCode(params.row._index + 65);
                        }
                    },
                    {
                        title: '答案内容',
                        key: 'answerContent'
                    },
                    {
                        title: '图片',
                        align: 'center',
                        width: 120,
                        render(row, column, index) {
                            return `<fs-img-upload
                                       action="/oa/lottery/uploadfile"
                                       path="/oa/upload/"
                                       :upload.sync="${row.pic}"></fs-img-upload>`;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 60,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '删除',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'trash-a',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._removeAnswerList(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                editorSettingData: {
                    name: '',
                    type: '1',
                    subject: '',
                    mark: 0,
                    singleType: '',
                    multiType: [],
                    questionList: [
                        {
                            answerContent: '',
                            pic: []
                        }
                    ],
                    desc: '',
                    answer: ''
                },
                postColumns: [
                    {
                        title: '试题名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '试题分类',
                        key: 'postname',
                        align: 'center'
                    },
                    {
                        title: '试题类型',
                        key: 'user_name',
                        align: 'center',
                        render: (h, params) => {
                            return this.typeOptMap[params.row.type - 1].label;
                        }
                    },
                    {
                        title: '试题分数',
                        key: 'questionmark',
                        align: 'center'
                    },
                    {
                        title: '创建日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '修改试题',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'edit',
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
                typeOptMap: [
                    {
                        value: '1',
                        label: '单选题'
                    },
                    {
                        value: '2',
                        label: '多选题'
                    },
                    {
                        value: '3',
                        label: '判断题'
                    },
                    {
                        value: '4',
                        label: '填空题'
                    },
                    {
                        value: '5',
                        label: '问答题'
                    }
                ],
                subjectList: [],
                tableHeight: 300
            };
        },
        created() {
            this._getSubjectList();
            this._setTableHeight();
        },
        filters: {
            indexToBigCode(val) {
                return String.fromCharCode(val + 65);
            }
        },
        methods: {
            _addNewAnswer() {
                let obj = {};
                obj.answerContent = '';
                obj.pic = '';
                this.editorSettingData.questionList.push(obj);
            },
            _initEditorSettingData() {
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _removeAnswerList(data) {
                let questionList = this.editorSettingData.questionList;
                if (questionList.length === 1) {
                    this.$Message.error('答案选项至少一个!');
                    return;
                }
                this.editorSettingData.questionList.splice(data._index, 1);
                console.log(data);
            },
            _editorSetting(data) {
                this._initEditorSettingData();
                this.editorSettingFlag = true;
            },
            _getSubjectList() {
                this.$http.get('/examquestion/getSubjectList').then((res) => {
                    if (res.success) {
                        this.subjectList = res.data;
                    }
                });
            }
        },
        components: {
            fsTablePage,
            fsImgUpload
        }
    };
</script>
