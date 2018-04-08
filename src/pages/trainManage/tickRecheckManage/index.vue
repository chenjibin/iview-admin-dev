<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="周期类型">
                    <Select v-model="filterOpt.review_type.value"
                            clearable
                            placeholder="筛选类型"
                            style="width: 100px">
                        <Option :value="2">月度复盘</Option>
                        <Option :value="3">季度复盘</Option>
                        <Option :value="4">年度复盘</Option>
                    </Select>
                </FormItem>
                <FormItem label="时间">
                    <DatePicker @on-change="filterOpt.review_time.value = $event"
                                :value="filterOpt.review_time.value"></DatePicker>
                </FormItem>
                <FormItem label="部门">
                    <Input v-model="filterOpt.organize_name.value"></Input>
                </FormItem>
                <FormItem label="岗位">
                    <Input v-model="filterOpt.post_name.value"></Input>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" @click="_createClassOpen">
                            <Icon type="plus-round"></Icon>
                            新增复盘
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           ref="classTable"
                           :choosearray.sync="classChooseDataArray"
                           url="/train/review_time_datalist"></fs-table-page>
        </Card>
        <Modal v-model="modelFlag" width="1000" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{classFormType === 'add'? '新建' : '修改'}}复盘</span>
            </p>
            <Form :rules="classRules"
                  :model="classForm"
                  ref="classForm"
                  :label-width="100">
                <Row :gutter="8">
                    <Col :span="12">
                        <FormItem label="周期类型">
                            <Select v-model="classForm.review_type"
                                    placeholder="筛选类型">
                                <Option value="2">月度复盘</Option>
                                <Option value="3">季度复盘</Option>
                                <Option value="4">年度复盘</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="培训类型">
                            <Select v-model="classForm.class_type_id"
                                    placeholder="筛选类型">
                                <Option :value="item.id"
                                        v-for="item,index in trainTypeOpt"
                                        :key="'trainTypeOpt' + index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem label="时间">
                            <DatePicker @on-change="classForm.review_time = $event"
                                        :clearable="false"
                                        :value="classForm.review_time"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="部门">
                        <Input v-model="classForm.organize_name"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem label="岗位">
                        <Input v-model="classForm.post_name"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="培训目标">
                        <Input v-model="classForm.target" type="textarea"  :autosize="{minRows: 4,maxRows: 4}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="完成情况">
                        <Input v-model="classForm.complete_extent" type="textarea"  :autosize="{minRows: 4,maxRows: 4}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="学员参与度">
                        <Input v-model="classForm.trainee_join_extent" type="textarea"  :autosize="{minRows: 4,maxRows: 4}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="培训亮点">
                        <Input v-model="classForm.advantage" type="textarea"  :autosize="{minRows: 4,maxRows: 4}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="培训不足">
                        <Input v-model="classForm.shortage" type="textarea"  :autosize="{minRows: 4,maxRows: 4}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="可能原因">
                        <Input v-model="classForm.shortage_cause" type="textarea"  :autosize="{minRows: 4,maxRows: 4}"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="12">
                    <FormItem label="行动计划">
                        <Input v-model="classForm.action_plan" type="textarea"  :autosize="{minRows: 4,maxRows: 4}"></Input>
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
    const NOW_DAY = moment().format('YYYY-MM-DD');
    export default {
        name: 'tickRecheckManage',
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
                    action_plan: '',
                    review_time: NOW_DAY,
                    review_type: '',
                    class_type_id: '',
                    post_name: '',
                    organize_name: ''
                },
                postColumns: [
                    {
                        title: '类型',
                        key: 'review_type',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('span', params.row.review_type === 2 ? '月度复盘' : params.row.review_type === 3 ? '季度复盘' : '年度复盘');
                        }
                    },
                    {
                        title: '日期',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return h('span', moment(params.row.review_time).format('YYYY-MM-DD'));
                        }
                    },
                    {
                        title: '培训类型',
                        key: 'class_type',
                        width: 100
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organize_name',
                        width: 160
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        key: 'post_name',
                        width: 160
                    },
                    {
                        title: '培训目标',
                        key: 'target',
                        width: 200
                    },
                    {
                        title: '完成情况',
                        key: 'complete_extent',
                        width: 200
                    },
                    {
                        title: '学员参与度',
                        key: 'trainee_join_extent',
                        width: 200
                    },
                    {
                        title: '培训亮点',
                        key: 'advantage',
                        width: 200
                    },
                    {
                        title: '培训不足',
                        key: 'shortage',
                        width: 200
                    },
                    {
                        title: '可能原因',
                        key: 'shortage_cause',
                        width: 200
                    },
                    {
                        title: '行动计划',
                        key: 'action_plan',
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
                ],
                filterOpt: {
                    review_type: {
                        value: '',
                        type: 'select'
                    },
                    review_time: {
                        value: '',
                        type: 'date'
                    },
                    organize_name: {
                        value: '',
                        type: 'input'
                    },
                    post_name: {
                        value: '',
                        type: 'input'
                    }
                },
                trainTypeOpt: [],
                teacherOpt: []
            };
        },
        created() {
            this._setTableHeight();
            this._getTrainTypeOpt();
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
                    action_plan: '',
                    review_time: NOW_DAY,
                    review_type: '',
                    class_type_id: '',
                    post_name: '',
                    organize_name: ''
                };
            },
            _addClassHandler() {
                let data = JSON.parse(JSON.stringify(this.classForm));
                if (this.classFormType === 'update') data.id = this.classId;
                this.$http.post('/train/review_time_add', data).then((res) => {
                    if (res.success) {
                        this.modelFlag = false;
                        this._updateClassTable();
                        this.$Message.success('操作成功!');
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
                classForm.review_time = moment(data.review_time).format('YYYY-MM-DD');
                classForm.review_type = data.review_type + '';
                classForm.class_type_id = data.class_type_id;
                classForm.post_name = data.post_name;
                classForm.organize_name = data.organize_name;
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
