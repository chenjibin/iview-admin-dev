<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" @click="mubanFlag = true">
                            <Icon type="gear-b"></Icon>
                            课程类型
                        </Button>
                        <Button type="primary" @click="modelFlag = true">
                            <Icon type="plus-round"></Icon>
                            新建课程
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           url="/train/class_datalist"></fs-table-page>
        </Card>
        <Modal v-model="mubanFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>课程类型</span>
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
                            style="margin-left: 8px">添加类型</Button>
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
                                <Button type="primary" @click="_addPost" :loading="banciBtnLoading">添加类型</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Poptip>
                <Button type="ghost" style="margin-left: 8px" @click="mubanFlag = false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="modelFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>新建课程</span>
            </p>
            <Form :rules="classRules"
                  :model="classForm"
                  ref="classForm"
                  :label-width="100">
                <Row :gutter="8">
                    <Col :span="24">
                        <FormItem label="培训名称">
                            <Input v-model="classForm.title"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="讲师">
                            <Select v-model="classForm.teacher_id"
                                    style="width: 100px">
                                <Option value="textfield" >文本</Option>
                                <Option value="textarea" >文本域</Option>
                                <Option value="numberfield" >数字</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="培训类型">
                            <Select v-model="classForm.type"
                                    style="width: 100px">
                                <Option value="textfield" >文本</Option>
                                <Option value="textarea" >文本域</Option>
                                <Option value="numberfield" >数字</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="培训日期">
                            <DatePicker @on-change="classForm.class_date = $event"
                                        :clearable="false"
                                        :value="classForm.class_date"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="上课时间">
                            <Input v-model="classForm.period"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="培训地点">
                            <Input v-model="classForm.position"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="学分">
                            <InputNumber :min="0" v-model="classForm.credit"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="讲师金币">
                            <InputNumber :min="0" v-model="classForm.teacher_coin"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="人数限制">
                            <InputNumber :min="0" v-model="classForm.trainee_max_num"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="内容简介">
                            <Input v-model="classForm.about" type="textarea"  :autosize="{minRows: 2,maxRows: 5}"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px">新建课程</Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import moment from 'moment';
    const NOW_DAY = moment().format('YYYY-MM-DD');
    export default {
        name: 'curriculumManage',
        data () {
            return {
                modelFlag: false,
                mubanFlag: false,
                banciBtnLoading: false,
                tableHeight: 300,
                chooseDataArray: [],
                banciRules: {
                    postName: [
                        { required: true, message: '岗位名称不能为空', trigger: 'blur' }
                    ]
                },
                banciForm: {
                    postName: '',
                    remark: ''
                },
                classId: 0,
                classRules: {},
                classForm: {
                    type: '',
                    title: '',
                    class_date: NOW_DAY,
                    period: '',
                    position: '',
                    credit: 0,
                    teacher_id: '',
                    teacher_coin: 0,
                    trainee_max_num: 0,
                    about: ''
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
                    }
                ],
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '日期',
                        key: 'user_name',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return moment(params.row.class_date).format('YYYY-MM-DD');
                        }
                    },
                    {
                        title: '时间',
                        align: 'center',
                        key: 'period',
                        width: 200
                    },
                    {
                        title: '培训名称',
                        key: 'title'
                    },
                    {
                        title: '培训类型',
                        key: 'type_name',
                        width: 100
                    },
                    {
                        title: '地点',
                        align: 'center',
                        key: 'position',
                        width: 100
                    },
                    {
                        title: '学分',
                        align: 'center',
                        key: 'credit',
                        width: 60
                    },
                    {
                        title: '讲师',
                        key: 'teacher_name',
                        width: 80
                    },
                    {
                        title: '讲师金币',
                        align: 'center',
                        key: 'teacher_coin',
                        width: 100
                    },
                    {
                        title: '人数限制',
                        align: 'center',
                        key: 'trainee_max_num',
                        width: 100
                    },
                    {
                        title: '已参人数',
                        key: 'has_baoming',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return params.row.has_baoming || 0;
                        }
                    },
                    {
                        title: '操作',
                        fixed: 'right',
                        align: 'center',
                        width: 160,
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
                ],
                filterOpt: {
                    post_name: {
                        value: '',
                        type: 'input'
                    }
                }
            };
        },
        watch: {
            chooseDataArray(val) {
                console.log(val);
            }
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            formReset (name) {
                this.$refs[name].resetFields();
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
            _nodeChangeHandler(data) {
                this.filterOpt.organizeId.value = data.id;
            },
            _checkTest(data) {
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            }
        },
        components: {
            fsTablePage,
            fsDepTree
        }
    };
</script>
