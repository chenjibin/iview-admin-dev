<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="培训类型">
                    <Select v-model="filterOpt.class_type.value"
                            clearable
                            placeholder="筛选类型"
                            style="width: 100px">
                        <Option :value="item.id"
                                v-for="item,index in trainTypeOpt"
                                :key="'trainTypeOpt' + index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="时间">
                    <DatePicker @on-change="filterOpt.class_date.value = $event"
                                :clearable="false"
                                :value="filterOpt.class_date.value"></DatePicker>
                </FormItem>
                <FormItem label="讲师">
                    <Select v-model="filterOpt.teacher_id.value"
                            clearable
                            style="width: 160px;">
                        <Option :value="item.user_id"
                                v-for="item,index in teacherOpt"
                                :key="'teacherOpt' + index">{{item.user_name}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           ref="classTable"
                           :choosearray.sync="classChooseDataArray"
                           url="/train/review_class_datalist"></fs-table-page>
        </Card>
        <Modal v-model="modelFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{classFormType === 'add'? '新建' : '修改'}}复盘</span>
            </p>
            <Form :rules="classRules"
                  :model="classForm"
                  ref="classForm"
                  :label-width="100">
                <Row :gutter="8">
                    <Col :span="24">
                    <FormItem label="培训目标">
                        <Input v-model="classForm.target" type="textarea"  :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="完成情况">
                        <Input v-model="classForm.complete_extent" type="textarea"  :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="学员参与度">
                        <Input v-model="classForm.trainee_join_extent" type="textarea"  :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="培训亮点">
                        <Input v-model="classForm.advantage" type="textarea"  :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="培训不足">
                        <Input v-model="classForm.shortage" type="textarea"  :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="可能原因">
                        <Input v-model="classForm.shortage_cause" type="textarea"  :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="行动计划">
                        <Input v-model="classForm.action_plan" type="textarea"  :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" @click="_addClassHandler">{{classFormType === 'add'? '新建' : '修改'}}复盘</Button>
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
    export default {
        name: 'classRecheckManage',
        data () {
            return {
                modelFlag: false,
                classFormType: 'add',
                tableHeight: 300,
                classChooseDataArray: [],
                classId: 0,
                classRules: {},
                classForm: {
                    target: '',
                    complete_extent: '',
                    trainee_join_extent: '',
                    advantage: '',
                    shortage: '',
                    shortage_cause: '',
                    action_plan: ''
                },
                postColumns: [
                    {
                        title: '日期',
                        key: 'user_name',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return h('span', moment(params.row.class_date).format('YYYY-MM-DD'));
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
                        title: '讲师',
                        key: 'teacher_name',
                        width: 80
                    },
                    {
                        title: '培训目标',
                        key: 'target'
                    },
                    {
                        title: '完成情况',
                        key: 'complete_extent'
                    },
                    {
                        title: '学员参与度',
                        key: 'trainee_join_extent'
                    },
                    {
                        title: '培训亮点',
                        key: 'advantage'
                    },
                    {
                        title: '培训不足',
                        key: 'shortage'
                    },
                    {
                        title: '操作',
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
                ],
                filterOpt: {
                    class_type: {
                        value: '',
                        type: 'select'
                    },
                    teacher_id: {
                        value: '',
                        type: 'select'
                    },
                    class_date: {
                        value: '',
                        type: 'date'
                    }
                },
                trainTypeOpt: [],
                teacherOpt: []
            };
        },
        created() {
            this._setTableHeight();
            this._getTrainTypeOpt();
            this._getTeacherOpt();
        },
        methods: {
            formReset (name) {
                this.$refs[name].resetFields();
            },
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
            },
            _initClassForm() {
                this.classForm = {
                    target: '',
                    complete_extent: '',
                    trainee_join_extent: '',
                    advantage: '',
                    shortage: '',
                    shortage_cause: '',
                    action_plan: ''
                };
            },
            _addClassHandler() {
                let data = JSON.parse(JSON.stringify(this.classForm));
                if (this.classFormType === 'update') {
                    data.review_id = this.classId;
                    data.id = this.classId;
                }
                this.$http.post('/train/review_class_add', data).then((res) => {
                    if (res.success) {
                        this.modelFlag = false;
                        this._updateClassTable();
                        this.$Message.success('操作成功!');
                    }
                });
            },
            _getTeacherOpt() {
                this.$http.get('/train/teacher_comboxData').then((res) => {
                    if (res.success) {
                        this.teacherOpt = res.data;
                    }
                });
            },
            _getTrainTypeOpt() {
                this.$http.get('/train/class_type_comboxData').then((res) => {
                    if (res.success) {
                        this.trainTypeOpt = res.data;
                    }
                });
            },
            _createClassOpen() {
                this.classFormType = 'add';
                this._initClassForm();
                this.modelFlag = true;
            },
            _checkTest(data) {
                this.classFormType = 'update';
                this._initClassForm();
                this.classId = data.id;
                let classForm = this.classForm;
                classForm.target = data.target;
                classForm.complete_extent = data.complete_extent;
                classForm.trainee_join_extent = data.trainee_join_extent;
                classForm.advantage = data.advantage;
                classForm.shortage = data.shortage;
                classForm.shortage_cause = data.shortage_cause;
                classForm.action_plan = data.action_plan;
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _updateClassTable() {
                this.$refs.classTable.getListData();
            }
        },
        components: {
            fsTablePage,
            fsDepTree
        }
    };
</script>
