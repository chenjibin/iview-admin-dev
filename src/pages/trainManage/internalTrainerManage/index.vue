<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" @click="mubanFlag = true">
                            <Icon type="gear-b"></Icon>
                            岗位架构
                        </Button>
                        <Button type="primary" @click="_createClassOpen">
                            <Icon type="plus-round"></Icon>
                            新增讲师
                        </Button>
                        <Button type="error"
                                :disabled="!classChooseDataArray.length"
                                @click="_delClass">
                            <Icon type="ios-trash-outline"></Icon>
                            删除讲师
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           ref="classTable"
                           :choosearray.sync="classChooseDataArray"
                           url="/train/teacher_datalist"></fs-table-page>
        </Card>
        <Modal v-model="mubanFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>岗位架构</span>
            </p>
            <fs-table-page :columns="mubanColumns"
                           :height="300"
                           ref="postAdd"
                           :choosearray.sync="chooseDataArray"
                           url="/train/postDataList"></fs-table-page>
            <div slot="footer">
                <Poptip confirm
                        title="您确认删除所选岗位吗？"
                        transfer
                        @on-ok="_deletePost">
                    <Button style="margin-left: 8px"
                            type="error"
                            :disabled="!chooseDataArray.length">删除</Button>
                </Poptip>
                <Button type="primary"
                        :disabled="!(chooseDataArray.length === 1)"
                        style="margin-left: 8px"
                        @click="">修改</Button>
                <Poptip placement="left" width="400">
                    <Button type="primary"
                            style="margin-left: 8px">添加岗位</Button>
                    <div class="banci-add-form" slot="content">
                        <Form :rules="banciRules"
                              :model="banciForm"
                              ref="banciForm"
                              :label-width="100">
                            <FormItem label="岗位名称" prop="postName">
                                <Input v-model="banciForm.postName"></Input>
                            </FormItem>
                            <FormItem label="备注" prop="remark">
                                <Input v-model="banciForm.remark"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="_addPost" :loading="banciBtnLoading">添加岗位</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Poptip>
                <Button type="ghost" style="margin-left: 8px" @click="mubanFlag = false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="modelFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{classFormType === 'add'? '新建' : '修改'}}讲师</span>
            </p>
            <Form :rules="classRules"
                  :model="classForm"
                  ref="classForm"
                  :label-width="100">
                <Row :gutter="8">
                    <Col :span="12">
                    <FormItem label="姓名">
                        <fs-search-user v-model="classForm.user_id"
                                        :optionlist.sync="nameForm.nameOpt"
                                        :clearable="true"
                                        :label="nameForm.nameLabel"></fs-search-user>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="岗位">
                        <Select v-model="classForm.post_id">
                            <Option :value="item.id"
                                    v-for="item,index in allPostData"
                                    :key="'teacherOpt' + index">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="编制等级">
                        <Input v-model="classForm.level"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="授课类型">
                        <Input v-model="classForm.class_type"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="授课课题">
                        <Input v-model="classForm.class_name"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="授课年限">
                        <InputNumber :min="0" v-model="classForm.class_years"></InputNumber>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="授课课时">
                        <InputNumber :min="0" v-model="classForm.class_times"></InputNumber>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="授课评价">
                        <Input v-model="classForm.comment" type="textarea"  :autosize="{minRows: 4,maxRows: 5}"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" @click="_addClassHandler">{{classFormType === 'add'? '新建' : '修改'}}讲师</Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsSearchUser from '@/baseComponents/fs-search-user';
    import moment from 'moment';
    export default {
        name: 'internalTrainerManage',
        data () {
            return {
                modelFlag: false,
                mubanFlag: false,
                banciBtnLoading: false,
                classFormType: 'add',
                tableHeight: 300,
                chooseDataArray: [],
                classChooseDataArray: [],
                allPostData: [],
                nameForm: {
                    nameOpt: [],
                    nameLabel: ''
                },
                classId: 0,
                classRules: {},
                classForm: {
                    user_id: '',
                    post_id: '',
                    level: '',
                    class_type: '',
                    class_name: '',
                    class_years: 0,
                    class_times: 0,
                    comment: ''
                },
                banciRules: {
                    postName: [
                        { required: true, message: '岗位名称不能为空', trigger: 'blur' }
                    ]
                },
                banciForm: {
                    postName: '',
                    remark: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleData: [],
                mubanColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '备注',
                        key: 'remark'
                    }
                ],
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'user_name',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organize_name'
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        key: 'post_name',
                        width: 100
                    },
                    {
                        title: '编制等级',
                        align: 'center',
                        key: 'level',
                        width: 100
                    },
                    {
                        title: '授课类型',
                        align: 'center',
                        key: 'class_type',
                        width: 200
                    },
                    {
                        title: '授课课题',
                        key: 'class_name'
                    },
                    {
                        title: '授课年限',
                        align: 'center',
                        key: 'class_years',
                        width: 100
                    },
                    {
                        title: '已授课时',
                        align: 'center',
                        key: 'class_times',
                        width: 200
                    },
                    {
                        title: '授课评价',
                        key: 'comment',
                        width: 200
                    },
                    {
                        title: '操作',
                        fixed: 'right',
                        align: 'center',
                        width: 80,
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
                                            icon: 'edit',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function() {
                                                vm._checkTest(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ]
            };
        },
        created() {
            this._setTableHeight();
            this._getAllpost();
        },
        methods: {
            formReset (name) {
                this.$refs[name].resetFields();
            },
            _initClassForm() {
                this.classForm = {
                    user_id: '',
                    post_id: '',
                    level: '',
                    class_type: '',
                    class_name: '',
                    class_years: 0,
                    class_times: 0,
                    comment: ''
                };
                this.nameForm.nameLabel = '';
                this.nameForm.nameOpt = [];
            },
            _deletePost() {
                let data = {};
                data.ids = this.chooseDataArray.map(x => x.id).join(',');
                this.$http.post('/train/deletePost', data).then((res) => {
                    if (res.success) {
                        this.$refs.postAdd.getListData();
                        this.chooseDataArray = [];
                        this.$Message.success('删除成功！');
                    }
                });
            },
            _addPost() {
                this.$refs.banciForm.validate((valid) => {
                    if (valid) {
                        this.banciBtnLoading = true;
                        let data = {};
                        data.name = this.banciForm.postName;
                        data.remark = this.banciForm.remark;
                        this.$http.post('/train/addPost', data).then((res) => {
                            if (res.success) {
                                this.formReset('banciForm');
                                this.$refs.postAdd.getListData();
                                this.$Message.success('岗位添加成功！');
                            }
                        }).finally(() => {
                            this.banciBtnLoading = false;
                        });
                    }
                });
            },
            _addClassHandler() {
                let data = JSON.parse(JSON.stringify(this.classForm));
                if (this.classFormType === 'update') data.id = this.classId;
                this.$http.post('/train/teacher_add', data).then((res) => {
                    if (res.success) {
                        this.modelFlag = false;
                        this._updateClassTable();
                        this.$Message.success('操作成功!');
                    }
                });
            },
            _delClass() {
                this.$Modal.confirm({
                    content: '确认删除所选讲师么？',
                    okText: '确认删除',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.ids = this.classChooseDataArray.map(x => x.id).join(',');
                        this.$http.post('/train/teacher_delete', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('删除成功!');
                                this._updateClassTable();
                            }
                        });
                    }
                });
            },
            _createClassOpen() {
                this.classFormType = 'add';
                this._initClassForm();
                this.modelFlag = true;
            },
            _nodeChangeHandler(data) {
                this.filterOpt.organizeId.value = data.id;
            },
            _checkTest(data) {
                this.classFormType = 'update';
                this._initClassForm();
                this.classId = data.id;
                let classForm = this.classForm;
                classForm.user_id = +data.user_id;
                classForm.post_id = +data.post_id;
                classForm.level = data.level;
                classForm.class_type = data.class_type;
                classForm.class_name = data.class_name;
                classForm.class_years = data.class_years;
                classForm.class_times = data.class_times;
                classForm.comment = data.comment;
                this.nameForm.nameLabel = data.user_name;
                this.nameForm.nameOpt = [
                    {
                        id: +data.user_id,
                        realname: data.user_name,
                        organizename: ''
                    }
                ];
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _getAllpost() {
                this.$http.get('/train/postComboxData').then((res) => {
                    if (res.success) {
                        this.allPostData = res.data;
                    }
                });
            },
            _updateClassTable() {
                this.$refs.classTable.getListData();
            }
        },
        components: {
            fsTablePage,
            fsSearchUser
        }
    };
</script>
