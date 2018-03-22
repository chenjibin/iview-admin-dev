<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="试卷名称">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选试卷"></Input>
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
                    <FormItem label="是否随机">
                        <RadioGroup v-model="editorSettingData.isRandom">
                            <Radio label="1">正常</Radio>
                            <Radio label="2">随机</Radio>
                        </RadioGroup>
                    </FormItem>
                    <div class="" v-show="editorSettingData.isRandom === '2'">
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
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'paperManage',
        data () {
            return {
                editorSettingFlag: false,
                btnLoading: false,
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
                    }
                },
                editorSettingData: {
                    name: '',
                    isRandom: '1',
                    subject: '',
                    singleTypeNum: 0,
                    multiTypeNum: 0,
                    trueOrFalseTypeNum: 0,
                    fillTypeNum: 0,
                    questionTypeNum: 0
                },
                postColumns: [
                    {
                        title: '试卷名称',
                        key: 'name'
                    },
                    {
                        title: '总分',
                        key: 'totlemark',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '状态',
                        key: 'user_name',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return this.statusList[params.row.status - 1].name;
                        }
                    },
                    {
                        title: '创建人',
                        key: 'createbyname',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '创建时间',
                        key: 'createbydate',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '操作',
                        key: 'user_name',
                        align: 'center',
                        width: 400
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
        methods: {
            _initEditorSettingData() {
                this.$refs.paperForm.resetFields();
                let editorSetting = this.editorSettingData;
                editorSetting.name = '';
                editorSetting.isRandom = '1';
                editorSetting.subject = '';
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
                        if (editorSetting.isRandom === '1') {
                            let sendData = {};
                            sendData.name = editorSetting.name;
                            this.$http.post('/examtestpaper/add', sendData).then((res) => {
                                if (res.success) {
                                }
                            });
                        } else {
                        }
                    }
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
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
            fsTablePage
        }
    };
</script>
